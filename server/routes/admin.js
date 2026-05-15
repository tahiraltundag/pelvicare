const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(verifyToken, requireRole('admin', 'superadmin'));

router.get('/dashboard', async (req, res) => {
  try {
    const [totalOrders, totalBulkOrders, totalRevenue, totalUsers, totalProducts, recentOrders, lowStockProducts] = await Promise.all([
      prisma.order.count(),
      prisma.bulkOrderRequest.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.user.count(),
      prisma.product.count({ where: { deletedAt: null, status: 'aktif' } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, items: true },
      }),
      prisma.product.findMany({
        where: { deletedAt: null, status: 'aktif', stock: { lte: 5 } },
        select: { id: true, name: true, stock: true, lowStockThreshold: true },
      }),
    ]);

    const recentMapped = recentOrders.map(o => ({
      ...o,
      address: (() => { try { return JSON.parse(o.address); } catch { return {}; } })(),
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders: totalOrders + totalBulkOrders,
          totalRevenue: totalRevenue._sum.total || 0,
          totalUsers,
          totalProducts,
        },
        recentOrders: recentMapped,
        lowStockProducts,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));

    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true, _count: { select: { orders: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ success: true, data: users, meta: { total, page: pageNum, totalPages: Math.ceil(total / limitNum) } });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.patch('/users/:id', async (req, res) => {
  const { role, isActive } = req.body;
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, error: 'Kendi hesabınızı düzenleyemezsiniz' });
  }
  try {
    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [allOrders, products] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: twelveMonthsAgo } },
        select: { total: true, status: true, createdAt: true },
      }),
      prisma.product.findMany({
        where: { deletedAt: null, status: 'aktif' },
        select: { name: true, stock: true, price: true, comparePrice: true },
        orderBy: { stock: 'asc' },
        take: 20,
      }),
    ]);

    // Monthly revenue + order counts (last 12 months)
    const monthlyMap = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('tr-TR', { month: 'short', year: '2-digit' });
      monthlyMap[key] = { label, gelir: 0, siparis: 0, iptal: 0 };
    }
    for (const o of allOrders) {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) continue;
      monthlyMap[key].siparis += 1;
      if (o.status === 'iptal') {
        monthlyMap[key].iptal += o.total;
      } else {
        monthlyMap[key].gelir += o.total;
      }
    }
    const monthlyRevenue = Object.values(monthlyMap).map(m => ({
      ...m,
      gelir: Math.round(m.gelir),
      iptal: Math.round(m.iptal),
    }));

    // Order status distribution
    const statusCount = {};
    for (const o of allOrders) {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    }
    const STATUS_TR = { beklemede: 'Beklemede', onaylandi: 'Onaylandı', kargoda: 'Kargoda', teslim_edildi: 'Teslim Edildi', iptal: 'İptal' };
    const orderStatusDist = Object.entries(statusCount).map(([status, count]) => ({
      name: STATUS_TR[status] || status,
      value: count,
      status,
    }));

    // P&L summary
    const totalRevenue = allOrders.filter(o => o.status !== 'iptal').reduce((s, o) => s + o.total, 0);
    const totalCancelled = allOrders.filter(o => o.status === 'iptal').reduce((s, o) => s + o.total, 0);
    const delivered = allOrders.filter(o => o.status === 'teslim_edildi').reduce((s, o) => s + o.total, 0);
    const pending = allOrders.filter(o => ['beklemede', 'onaylandi', 'kargoda'].includes(o.status)).reduce((s, o) => s + o.total, 0);

    res.json({
      success: true,
      data: {
        monthlyRevenue,
        orderStatusDist,
        productStock: products.map(p => ({ name: p.name.length > 20 ? p.name.slice(0, 20) + '…' : p.name, stock: p.stock, price: p.price })),
        pnl: {
          totalRevenue: Math.round(totalRevenue),
          delivered: Math.round(delivered),
          pending: Math.round(pending),
          totalCancelled: Math.round(totalCancelled),
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const where = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { user: { select: { name: true, email: true } }, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    const mapped = orders.map(o => ({ ...o, address: (() => { try { return JSON.parse(o.address); } catch { return {}; } })() }));
    res.json({ success: true, data: mapped, meta: { total, page: pageNum, totalPages: Math.ceil(total / limitNum) } });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.get('/bulk-orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const where = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.bulkOrderRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.bulkOrderRequest.count({ where }),
    ]);

    res.json({ success: true, data: orders, meta: { total, page: pageNum, totalPages: Math.ceil(total / limitNum) } });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.patch('/bulk-orders/:id', async (req, res) => {
  const { status } = req.body;
  const valid = ['beklemede', 'gorusuldu', 'tamamlandi', 'iptal'];
  if (!valid.includes(status)) {
    return res.status(400).json({ success: false, error: 'Geçersiz durum' });
  }
  try {
    const order = await prisma.bulkOrderRequest.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ success: true, data: order });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

module.exports = router;
