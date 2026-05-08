const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const items = await prisma.cmsContent.findMany({ orderBy: { key: 'asc' } });
    const result = {};
    items.forEach(item => { result[item.key] = item; });
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const item = await prisma.cmsContent.findUnique({ where: { key: req.params.key } });
    if (!item) return res.status(404).json({ success: false, error: 'İçerik bulunamadı' });
    res.json({ success: true, data: item });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.put('/:key', verifyToken, requireRole('admin', 'superadmin'), async (req, res) => {
  const { value, type, label } = req.body;
  try {
    const item = await prisma.cmsContent.upsert({
      where: { key: req.params.key },
      update: { value: value ?? '', ...(type && { type }), ...(label && { label }) },
      create: { key: req.params.key, value: value ?? '', type: type || 'text', label: label || req.params.key },
    });
    res.json({ success: true, data: item });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.put('/', verifyToken, requireRole('admin', 'superadmin'), async (req, res) => {
  const { updates } = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ success: false, error: 'updates objesi gerekli' });
  }
  try {
    const ops = Object.entries(updates).map(([key, value]) =>
      prisma.cmsContent.upsert({
        where: { key },
        update: { value: typeof value === 'string' ? value : JSON.stringify(value) },
        create: { key, value: typeof value === 'string' ? value : JSON.stringify(value), type: 'text', label: key },
      })
    );
    await Promise.all(ops);
    const all = await prisma.cmsContent.findMany({ orderBy: { key: 'asc' } });
    const result = {};
    all.forEach(item => { result[item.key] = item; });
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

module.exports = router;
