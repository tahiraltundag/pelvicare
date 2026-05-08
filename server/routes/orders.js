const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, requireRole, optionalAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', optionalAuth, async (req, res) => {
  const { items, address, notes } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Sipariş kalemleri gerekli' });
  }
  if (!address || !address.firstName) {
    return res.status(400).json({ success: false, error: 'Teslimat adresi gerekli' });
  }

  try {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await prisma.order.create({
      data: {
        userId: req.user?.id || null,
        total,
        address: JSON.stringify(address),
        notes: notes || null,
        items: {
          create: items.map(item => ({
            productId: item.productId || null,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variant: item.variant || null,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Reduce stock for each item
    for (const item of items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        }).catch(() => {});
      }
    }

    res.status(201).json({ success: true, data: { ...order, address: JSON.parse(order.address) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Sipariş oluşturulurken hata' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));

    const where = {};
    if (!isAdmin) where.userId = req.user.id;
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true, user: isAdmin ? { select: { id: true, name: true, email: true } } : false },
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

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: { select: { id: true, name: true, images: true } } } }, user: { select: { id: true, name: true, email: true } } },
    });
    if (!order) return res.status(404).json({ success: false, error: 'Sipariş bulunamadı' });

    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);
    if (!isAdmin && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Bu siparişe erişim yetkiniz yok' });
    }

    res.json({ success: true, data: { ...order, address: (() => { try { return JSON.parse(order.address); } catch { return {}; } })() } });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.patch('/:id/status', verifyToken, requireRole('admin', 'superadmin'), async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['beklemede', 'onaylandi', 'kargoda', 'teslim_edildi', 'iptal'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Geçersiz durum' });
  }
  try {
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
    res.json({ success: true, data: order });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

module.exports = router;
