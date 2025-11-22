const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Comment out these until you create the functions
// router.get('/:id/inventory', productController.getProductInventory);
// router.get('/:id/movements', productController.getProductMovements);

module.exports = router;
