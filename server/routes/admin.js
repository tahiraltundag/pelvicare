const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(verifyToken, requireRole('admin', 'superadmin'));

router.get('/dashboard', async (req, res) => {
  try {
    const [totalOrders, totalRevenue, totalUsers, totalProducts, recentOrders, lowStockProducts] = await Promise.all([
      prisma.order.count(),
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
          totalOrders,
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

module.exports = router;
