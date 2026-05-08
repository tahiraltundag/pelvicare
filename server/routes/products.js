const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, requireRole, optionalAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

function parseJson(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort = 'createdAt', order = 'desc', page = 1, limit = 12, status } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = { deletedAt: null };

    const isAdmin = req.user && ['admin', 'superadmin'].includes(req.user.role);
    if (!isAdmin) {
      where.status = 'aktif';
    } else if (status) {
      where.status = status;
    }

    if (category) where.categoryId = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const sortField = ['price', 'createdAt', 'name', 'stock'].includes(sort) ? sort : 'createdAt';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    const mapped = products.map(p => ({
      ...p,
      images: parseJson(p.images, []),
      tags: parseJson(p.tags, []),
      variants: parseJson(p.variants, []),
    }));

    res.json({
      success: true,
      data: mapped,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: req.params.id }, { slug: req.params.id }], deletedAt: null },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });

    const isAdmin = req.user && ['admin', 'superadmin'].includes(req.user.role);
    if (!isAdmin && product.status !== 'aktif') {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }

    res.json({
      success: true,
      data: {
        ...product,
        images: parseJson(product.images, []),
        tags: parseJson(product.tags, []),
        variants: parseJson(product.variants, []),
      },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.post('/', verifyToken, requireRole('admin', 'superadmin'), async (req, res) => {
  const { name, slug, description, price, comparePrice, categoryId, tags, images, stock, lowStockThreshold, variants, status } = req.body;
  if (!name || !slug || price == null) {
    return res.status(400).json({ success: false, error: 'Ad, slug ve fiyat zorunlu' });
  }
  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        description: description || '',
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        categoryId: categoryId || null,
        tags: JSON.stringify(tags || []),
        images: JSON.stringify(images || []),
        stock: parseInt(stock) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 5,
        variants: JSON.stringify(variants || []),
        status: status || 'taslak',
      },
      include: { category: true },
    });
    res.status(201).json({ success: true, data: { ...product, images: parseJson(product.images, []), tags: parseJson(product.tags, []), variants: parseJson(product.variants, []) } });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, error: 'Bu slug zaten kullanımda' });
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.put('/:id', verifyToken, requireRole('admin', 'superadmin'), async (req, res) => {
  const { name, slug, description, price, comparePrice, categoryId, tags, images, stock, lowStockThreshold, variants, status } = req.body;
  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug.toLowerCase().replace(/\s+/g, '-');
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice ? parseFloat(comparePrice) : null;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (images !== undefined) updateData.images = JSON.stringify(images);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(lowStockThreshold);
    if (variants !== undefined) updateData.variants = JSON.stringify(variants);
    if (status !== undefined) updateData.status = status;

    const product = await prisma.product.update({ where: { id: req.params.id }, data: updateData, include: { category: true } });
    res.json({ success: true, data: { ...product, images: parseJson(product.images, []), tags: parseJson(product.tags, []), variants: parseJson(product.variants, []) } });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.delete('/:id', verifyToken, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
    res.json({ success: true, data: null });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

module.exports = router;
