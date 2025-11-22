const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Existing receipt routes
router.get('/', inventoryController.getAllReceipts);
router.get('/:id', inventoryController.getReceiptById);
router.post('/', inventoryController.createReceipt);
router.patch('/:id/status', inventoryController.updateReceiptStatus);
router.delete('/:id', inventoryController.deleteReceipt);

// NEW: Line items routes
router.get('/:id/lines', inventoryController.getReceiptLines);
router.post('/:id/lines', inventoryController.addReceiptLine);
router.put('/:id/lines/:lineId', inventoryController.updateReceiptLine);
router.delete('/:id/lines/:lineId', inventoryController.deleteReceiptLine);

module.exports = router;
