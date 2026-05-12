require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const uploadsPath = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cms', require('./routes/cms'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/clinician', require('./routes/clinician'));
app.use('/api/device', require('./routes/device'));
app.use('/api/uploads', require('./routes/uploads'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Sunucu hatası' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`PelvicAir server running on http://localhost:${PORT}`));
}

module.exports = app;
