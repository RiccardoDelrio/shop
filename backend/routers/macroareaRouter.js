const express = require("express");
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

// Get all macroareas with their categories
router.get('/', CategoryController.getAllMacroareas);

// Get categories by macroarea (by slug)
router.get('/:slug/categories', CategoryController.getCategoriesByMacroarea);

// Get products by macroarea (by slug)
router.get('/:slug/products', CategoryController.getProductsByMacroarea);

module.exports = router;
