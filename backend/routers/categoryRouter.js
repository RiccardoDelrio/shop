const express = require("express");
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

// Get all macroareas
router.get('/', CategoryController.getAllMacroareas);

// Get categories by macroarea
router.get('/:slug/categories', CategoryController.getCategoriesByMacroarea);

// Get products by macroarea
router.get('/:slug/products', CategoryController.getProductsByMacroarea);

// Get all categories (flattened list)
router.get('/categories', CategoryController.getAllCategories);

// Get products by category
router.get('/categories/:slug', CategoryController.getProductsByCategory);

module.exports = router;