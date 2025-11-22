const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Existing delivery routes
router.get('/', inventoryController.getAllDeliveries);
router.get('/:id', inventoryController.getDeliveryById);
router.post('/', inventoryController.createDelivery);

// NEW: Line items routes
router.get('/:id/lines', inventoryController.getDeliveryLines);
router.post('/:id/lines', inventoryController.addDeliveryLine);
router.put('/:id/lines/:lineId', inventoryController.updateDeliveryLine);
router.delete('/:id/lines/:lineId', inventoryController.deleteDeliveryLine);

module.exports = router;
