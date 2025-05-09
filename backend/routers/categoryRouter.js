const express = require("express");
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

// Get all categories (flattened list)
router.get('/categories', CategoryController.getAllCategories);

// Get products by category
router.get('/categories/:slug', CategoryController.getProductsByCategory);

module.exports = router;