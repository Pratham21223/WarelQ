const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getAllTransfers);
router.get('/:id', inventoryController.getTransferById);
router.post('/', inventoryController.createTransfer);

module.exports = router;
