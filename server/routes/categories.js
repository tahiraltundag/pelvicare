const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: categories });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.post('/', verifyToken, requireRole('admin', 'superadmin'), async (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) return res.status(400).json({ success: false, error: 'Ad ve slug gerekli' });
  try {
    const cat = await prisma.category.create({ data: { name, slug: slug.toLowerCase().replace(/\s+/g, '-') } });
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, error: 'Bu slug zaten kullanımda' });
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.put('/:id', verifyToken, requireRole('admin', 'superadmin'), async (req, res) => {
  const { name, slug } = req.body;
  try {
    const cat = await prisma.category.update({ where: { id: req.params.id }, data: { name, slug } });
    res.json({ success: true, data: cat });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.delete('/:id', verifyToken, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

module.exports = router;
