const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Use express.raw for webhook to preserve raw body for signature verification
router.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  webhookController.handleClerkWebhook
);

module.exports = router;
