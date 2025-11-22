require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// ⚠️ IMPORTANT: Webhook route MUST be registered BEFORE bodyParser
// This is required for Svix signature verification
const webhookRoutes = require('./routes/webhook.routes');
app.use('/api/webhooks', webhookRoutes);

// Now apply bodyParser for other routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'ok', message: 'Connected to Neon DB' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'DB connection failed' });
  }
});

// Import ALL routes now
const productRoutes = require('./routes/products.routes');
const receiptRoutes = require('./routes/receipts.routes');
const deliveryRoutes = require('./routes/deliveries.routes');
const transferRoutes = require('./routes/transfers.routes');
const reportRoutes = require('./routes/reports.routes');

// Register all routes
app.use('/api/products', productRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`✅ Try: curl http://localhost:${PORT}/api/health`);
  console.log(`🔐 Webhook: http://localhost:${PORT}/api/webhooks/clerk`);
});
