const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/dashboard', inventoryController.getDashboardStats);
router.get('/inventory', inventoryController.getInventoryReport);
router.get('/low-stock', inventoryController.getLowStockProducts);
router.get('/activity', inventoryController.getRecentActivity);

module.exports = router;
