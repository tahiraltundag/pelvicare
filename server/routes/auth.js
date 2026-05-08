const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, error: 'Çok fazla giriş denemesi, 15 dakika bekleyin' } });

function generateTokens(user, rememberMe = false) {
  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
  const refreshExpiry = rememberMe ? '30d' : (process.env.JWT_REFRESH_EXPIRES_IN || '7d');
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: refreshExpiry });
  return { accessToken, refreshToken, refreshExpiry };
}

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Geçerli bir e-posta girin'),
  body('password')
    .isLength({ min: 8 }).withMessage('Şifre en az 8 karakter olmalı')
    .matches(/[A-Z]/).withMessage('Şifre en az bir büyük harf içermeli')
    .matches(/[a-z]/).withMessage('Şifre en az bir küçük harf içermeli')
    .matches(/[0-9]/).withMessage('Şifre en az bir rakam içermeli'),
  body('name').trim().isLength({ min: 2 }).withMessage('Ad en az 2 karakter olmalı'),
];

router.post('/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }
  const { email, password, name } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ success: false, error: 'Bu e-posta adresi zaten kullanımda' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    const { accessToken, refreshToken, refreshExpiry } = generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (refreshExpiry.includes('30') ? 30 : 7));
    await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt } });

    res.status(201).json({
      success: true,
      data: { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Kayıt sırasında hata oluştu' });
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'E-posta ve şifre gerekli' });

  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(401).json({ success: false, error: 'E-posta veya şifre hatalı' });
    if (!user.isActive) return res.status(403).json({ success: false, error: 'Hesabınız askıya alınmış' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, error: 'E-posta veya şifre hatalı' });

    const { accessToken, refreshToken, refreshExpiry } = generateTokens(user, rememberMe);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7));
    await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt } });

    res.json({
      success: true,
      data: { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Giriş sırasında hata oluştu' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, error: 'Refresh token gerekli' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken }, include: { user: true } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ success: false, error: 'Geçersiz veya süresi dolmuş token' });
    }
    if (!stored.user.isActive) return res.status(403).json({ success: false, error: 'Hesabınız askıya alınmış' });

    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const { accessToken, refreshToken: newRefreshToken, refreshExpiry } = generateTokens(stored.user);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({ data: { userId: stored.user.id, token: newRefreshToken, expiresAt } });

    res.json({
      success: true,
      data: { accessToken, refreshToken: newRefreshToken, user: { id: stored.user.id, email: stored.user.email, name: stored.user.name, role: stored.user.role } },
    });
  } catch {
    res.status(401).json({ success: false, error: 'Geçersiz token' });
  }
});

router.post('/logout', verifyToken, async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } }).catch(() => {});
  }
  res.json({ success: true, data: null });
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true } });
    if (!user) return res.status(404).json({ success: false, error: 'Kullanıcı bulunamadı' });
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'E-posta gerekli' });

  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ success: true, data: { message: 'Şifre sıfırlama bağlantısı gönderildi' } });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour
    await prisma.passwordReset.create({ data: { email: user.email, token, expiresAt } });

    // In production, send email here
    console.log(`[DEV] Password reset token for ${email}: ${token}`);
    res.json({ success: true, data: { message: 'Şifre sıfırlama bağlantısı gönderildi', devToken: process.env.NODE_ENV !== 'production' ? token : undefined } });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

router.post('/reset-password', [
  body('token').notEmpty(),
  body('password')
    .isLength({ min: 8 }).withMessage('Şifre en az 8 karakter olmalı')
    .matches(/[A-Z]/).withMessage('Büyük harf içermeli')
    .matches(/[a-z]/).withMessage('Küçük harf içermeli')
    .matches(/[0-9]/).withMessage('Rakam içermeli'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

  const { token, password } = req.body;
  try {
    const reset = await prisma.passwordReset.findUnique({ where: { token } });
    if (!reset || reset.used || reset.expiresAt < new Date()) {
      return res.status(400).json({ success: false, error: 'Geçersiz veya süresi dolmuş bağlantı' });
    }
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { email: reset.email }, data: { password: hashed } });
    await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } });
    res.json({ success: true, data: { message: 'Şifreniz başarıyla güncellendi' } });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

module.exports = router;
