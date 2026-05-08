const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

const UPLOAD_DIR = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '../uploads');
const PRODUCTS_DIR = path.join(UPLOAD_DIR, 'products');
try {
  [UPLOAD_DIR, PRODUCTS_DIR].forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); });
} catch (e) {
  console.warn('Upload dizini oluşturulamadı:', e.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PRODUCTS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Yalnızca JPEG, PNG ve WebP dosyaları yüklenebilir'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, files: 5 },
});

router.post('/products', verifyToken, requireRole('admin', 'superadmin'), (req, res) => {
  upload.array('images', 5)(req, res, err => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, error: 'Dosya boyutu en fazla 5MB olabilir' });
      if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ success: false, error: 'En fazla 5 dosya yüklenebilir' });
      return res.status(400).json({ success: false, error: err.message });
    }
    if (err) return res.status(400).json({ success: false, error: err.message });
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, error: 'Dosya seçilmedi' });

    const urls = req.files.map(f => `/uploads/products/${f.filename}`);
    res.json({ success: true, data: { urls } });
  });
});

router.delete('/products/:filename', verifyToken, requireRole('admin', 'superadmin'), (req, res) => {
  const filename = path.basename(req.params.filename);
  const filepath = path.join(PRODUCTS_DIR, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
  res.json({ success: true, data: null });
});

module.exports = router;
