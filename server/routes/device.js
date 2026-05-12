const express = require('express');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Verify device token middleware
function deviceAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Cihaz token gerekli' });
  }
  req.deviceToken = authHeader.slice(7);
  next();
}

async function getPatientByToken(token) {
  return prisma.clinicianPatient.findUnique({ where: { deviceToken: token } });
}

/**
 * POST /api/device/link
 * Mobile app sends link code → receives device token
 * Body: { linkCode: "ABC123" }
 */
router.post('/link', async (req, res) => {
  const { linkCode } = req.body;
  if (!linkCode) return res.status(400).json({ success: false, error: 'Bağlantı kodu gerekli' });

  try {
    const patient = await prisma.clinicianPatient.findFirst({
      where: { linkCode: linkCode.toUpperCase().trim() },
      include: { clinician: { include: { user: { select: { name: true } } } } },
    });

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Geçersiz bağlantı kodu' });
    }
    if (patient.linkExpiresAt && patient.linkExpiresAt < new Date()) {
      return res.status(410).json({ success: false, error: 'Bağlantı kodunun süresi dolmuş. Doktorunuzdan yeni kod isteyin.' });
    }

    // Generate or reuse device token
    const deviceToken = patient.deviceToken || crypto.randomBytes(32).toString('hex');
    await prisma.clinicianPatient.update({
      where: { id: patient.id },
      data: { deviceToken, linkCode: null, linkExpiresAt: null },
    });

    res.json({
      success: true,
      data: {
        deviceToken,
        patientName: patient.name,
        clinicianName: patient.clinician.user.name,
        patientId: patient.id,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

/**
 * GET /api/device/me
 * Mobile app checks its linked patient
 */
router.get('/me', deviceAuth, async (req, res) => {
  try {
    const patient = await getPatientByToken(req.deviceToken);
    if (!patient) return res.status(401).json({ success: false, error: 'Geçersiz cihaz token' });

    res.json({
      success: true,
      data: {
        patientId: patient.id,
        patientName: patient.name,
        diagnosis: patient.diagnosis,
        gender: patient.gender,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

/**
 * POST /api/device/session
 * Mobile app sends a completed session
 * Body: {
 *   protocol: "K-01 — İdrar Kaçırma",
 *   startedAt: "2026-05-12T10:00:00Z",
 *   duration: 20,
 *   intensity: 7,
 *   modalitiesUsed: ["EMS", "Vibrasyon"],
 *   completedFully: true
 * }
 */
router.post('/session', deviceAuth, async (req, res) => {
  const { protocol, startedAt, duration = 20, intensity = 5, modalitiesUsed = [], completedFully = true } = req.body;

  if (!protocol) return res.status(400).json({ success: false, error: 'Protokol gerekli' });

  try {
    const patient = await getPatientByToken(req.deviceToken);
    if (!patient) return res.status(401).json({ success: false, error: 'Geçersiz cihaz token' });

    const session = await prisma.deviceSession.create({
      data: {
        patientId: patient.id,
        protocol,
        startedAt: startedAt ? new Date(startedAt) : new Date(),
        duration: parseInt(duration),
        intensity: parseInt(intensity),
        modalitiesUsed: JSON.stringify(Array.isArray(modalitiesUsed) ? modalitiesUsed : [modalitiesUsed]),
        completedFully: Boolean(completedFully),
        source: 'mobile',
      },
    });

    res.status(201).json({ success: true, data: { sessionId: session.id } });
  } catch {
    res.status(500).json({ success: false, error: 'Seans kaydedilemedi' });
  }
});

/**
 * GET /api/device/sessions
 * Mobile app fetches its own session history
 */
router.get('/sessions', deviceAuth, async (req, res) => {
  try {
    const patient = await getPatientByToken(req.deviceToken);
    if (!patient) return res.status(401).json({ success: false, error: 'Geçersiz cihaz token' });

    const sessions = await prisma.deviceSession.findMany({
      where: { patientId: patient.id },
      orderBy: { startedAt: 'desc' },
      take: 100,
    });

    res.json({ success: true, data: sessions });
  } catch {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

module.exports = router;
