const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const auth = [verifyToken, requireRole('clinician')];

// Register as clinician
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[a-z]/).matches(/[0-9]/),
  body('name').trim().isLength({ min: 2 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

  const { email, password, name, specialty = '', license = '', institution = '', phone = '' } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ success: false, error: 'Bu e-posta adresi zaten kullanımda' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email, password: hashed, name, role: 'clinician',
        clinicianProfile: { create: { specialty, license, institution, phone } },
      },
    });
    res.status(201).json({ success: true, data: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch {
    res.status(500).json({ success: false, error: 'Kayıt sırasında hata oluştu' });
  }
});

// Get clinician profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await prisma.clinicianProfile.findUnique({
      where: { userId: req.user.id },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!profile) return res.status(404).json({ success: false, error: 'Profil bulunamadı' });
    res.json({ success: true, data: profile });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

// Update clinician profile
router.put('/me', auth, async (req, res) => {
  const { specialty, license, institution, phone, name } = req.body;
  try {
    const [profile] = await Promise.all([
      prisma.clinicianProfile.update({
        where: { userId: req.user.id },
        data: { specialty, license, institution, phone },
      }),
      name && prisma.user.update({ where: { id: req.user.id }, data: { name } }),
    ]);
    res.json({ success: true, data: profile });
  } catch {
    res.status(500).json({ success: false, error: 'Güncelleme sırasında hata oluştu' });
  }
});

// List patients
router.get('/patients', auth, async (req, res) => {
  try {
    const profile = await prisma.clinicianProfile.findUnique({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ success: false, error: 'Profil bulunamadı' });

    const patients = await prisma.clinicianPatient.findMany({
      where: { clinicianId: profile.id },
      include: { _count: { select: { sessions: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: patients });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

// Add patient
router.post('/patients', auth, async (req, res) => {
  const { name, email = '', birthYear, gender = '', diagnosis = '', notes = '' } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'Hasta adı gerekli' });
  try {
    const profile = await prisma.clinicianProfile.findUnique({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ success: false, error: 'Profil bulunamadı' });

    const patient = await prisma.clinicianPatient.create({
      data: { clinicianId: profile.id, name, email, birthYear: birthYear ? parseInt(birthYear) : null, gender, diagnosis, notes },
    });
    res.status(201).json({ success: true, data: patient });
  } catch {
    res.status(500).json({ success: false, error: 'Hasta eklenirken hata oluştu' });
  }
});

// Update patient
router.put('/patients/:id', auth, async (req, res) => {
  const { name, email, birthYear, gender, diagnosis, notes } = req.body;
  try {
    const profile = await prisma.clinicianProfile.findUnique({ where: { userId: req.user.id } });
    const patient = await prisma.clinicianPatient.findFirst({ where: { id: req.params.id, clinicianId: profile?.id } });
    if (!patient) return res.status(404).json({ success: false, error: 'Hasta bulunamadı' });

    const updated = await prisma.clinicianPatient.update({
      where: { id: req.params.id },
      data: { name, email, birthYear: birthYear ? parseInt(birthYear) : null, gender, diagnosis, notes },
    });
    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, error: 'Güncelleme sırasında hata oluştu' });
  }
});

// Delete patient
router.delete('/patients/:id', auth, async (req, res) => {
  try {
    const profile = await prisma.clinicianProfile.findUnique({ where: { userId: req.user.id } });
    const patient = await prisma.clinicianPatient.findFirst({ where: { id: req.params.id, clinicianId: profile?.id } });
    if (!patient) return res.status(404).json({ success: false, error: 'Hasta bulunamadı' });

    await prisma.patientSession.deleteMany({ where: { patientId: req.params.id } });
    await prisma.clinicianPatient.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, error: 'Silme sırasında hata oluştu' });
  }
});

// Get patient with sessions
router.get('/patients/:id', auth, async (req, res) => {
  try {
    const profile = await prisma.clinicianProfile.findUnique({ where: { userId: req.user.id } });
    const patient = await prisma.clinicianPatient.findFirst({
      where: { id: req.params.id, clinicianId: profile?.id },
      include: { sessions: { orderBy: { date: 'desc' } } },
    });
    if (!patient) return res.status(404).json({ success: false, error: 'Hasta bulunamadı' });
    res.json({ success: true, data: patient });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

// Add session
router.post('/patients/:id/sessions', auth, async (req, res) => {
  const { protocol, date, duration = 20, notes = '' } = req.body;
  if (!protocol) return res.status(400).json({ success: false, error: 'Protokol gerekli' });
  try {
    const profile = await prisma.clinicianProfile.findUnique({ where: { userId: req.user.id } });
    const patient = await prisma.clinicianPatient.findFirst({ where: { id: req.params.id, clinicianId: profile?.id } });
    if (!patient) return res.status(404).json({ success: false, error: 'Hasta bulunamadı' });

    const session = await prisma.patientSession.create({
      data: { patientId: req.params.id, protocol, date: date ? new Date(date) : new Date(), duration: parseInt(duration), notes },
    });
    res.status(201).json({ success: true, data: session });
  } catch {
    res.status(500).json({ success: false, error: 'Seans eklenirken hata oluştu' });
  }
});

// Delete session
router.delete('/patients/:patientId/sessions/:sessionId', auth, async (req, res) => {
  try {
    const profile = await prisma.clinicianProfile.findUnique({ where: { userId: req.user.id } });
    const patient = await prisma.clinicianPatient.findFirst({ where: { id: req.params.patientId, clinicianId: profile?.id } });
    if (!patient) return res.status(404).json({ success: false, error: 'Hasta bulunamadı' });

    await prisma.patientSession.delete({ where: { id: req.params.sessionId } });
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, error: 'Silme sırasında hata oluştu' });
  }
});

// Generate link code for patient (mobile app uses this to connect)
router.post('/patients/:id/link-code', auth, async (req, res) => {
  try {
    const profile = await prisma.clinicianProfile.findUnique({ where: { userId: req.user.id } });
    const patient = await prisma.clinicianPatient.findFirst({ where: { id: req.params.id, clinicianId: profile?.id } });
    if (!patient) return res.status(404).json({ success: false, error: 'Hasta bulunamadı' });

    const linkCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-char hex e.g. "A3F9B2"
    const linkExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.clinicianPatient.update({
      where: { id: req.params.id },
      data: { linkCode, linkExpiresAt },
    });

    res.json({ success: true, data: { linkCode, linkExpiresAt } });
  } catch {
    res.status(500).json({ success: false, error: 'Kod oluşturulamadı' });
  }
});

// Get device sessions for a patient (from mobile app)
router.get('/patients/:id/device-sessions', auth, async (req, res) => {
  try {
    const profile = await prisma.clinicianProfile.findUnique({ where: { userId: req.user.id } });
    const patient = await prisma.clinicianPatient.findFirst({ where: { id: req.params.id, clinicianId: profile?.id } });
    if (!patient) return res.status(404).json({ success: false, error: 'Hasta bulunamadı' });

    const sessions = await prisma.deviceSession.findMany({
      where: { patientId: req.params.id },
      orderBy: { startedAt: 'desc' },
    });

    // Build daily usage map for last 30 days
    const now = new Date();
    const dailyMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    sessions.forEach(s => {
      const day = new Date(s.startedAt).toISOString().slice(0, 10);
      if (day in dailyMap) dailyMap[day]++;
    });
    const dailyUsage = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Streak: count consecutive days with at least 1 session (from today backwards)
    const sortedDays = Object.keys(dailyMap).sort((a, b) => b.localeCompare(a));
    let streak = 0;
    for (const day of sortedDays) {
      if (dailyMap[day] > 0) streak++;
      else break;
    }

    const today = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);

    res.json({
      success: true,
      data: {
        sessions,
        stats: {
          total: sessions.length,
          today: dailyMap[today] || 0,
          thisWeek: sessions.filter(s => new Date(s.startedAt) > weekAgo).length,
          streak,
          lastActive: sessions[0]?.startedAt || null,
          isLinked: !!patient.deviceToken,
          linkCode: patient.linkCode,
          linkExpiresAt: patient.linkExpiresAt,
        },
        dailyUsage,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

// Revoke device token (unlink mobile)
router.delete('/patients/:id/device-token', auth, async (req, res) => {
  try {
    const profile = await prisma.clinicianProfile.findUnique({ where: { userId: req.user.id } });
    const patient = await prisma.clinicianPatient.findFirst({ where: { id: req.params.id, clinicianId: profile?.id } });
    if (!patient) return res.status(404).json({ success: false, error: 'Hasta bulunamadı' });

    await prisma.clinicianPatient.update({ where: { id: req.params.id }, data: { deviceToken: null } });
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

// Bulk order (public)
router.post('/bulk-order', async (req, res) => {
  const { name, email, institution, phone = '', quantity = 1, message = '' } = req.body;
  if (!name || !email || !institution) {
    return res.status(400).json({ success: false, error: 'Ad, e-posta ve kurum zorunludur' });
  }
  try {
    const order = await prisma.bulkOrderRequest.create({
      data: { name, email, institution, phone, quantity: parseInt(quantity), message },
    });
    res.status(201).json({ success: true, data: order });
  } catch {
    res.status(500).json({ success: false, error: 'Başvuru sırasında hata oluştu' });
  }
});

module.exports = router;
