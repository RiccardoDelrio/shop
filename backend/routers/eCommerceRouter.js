const express = require("express");
const router = express.Router();
const eCommerceController = require('../controllers/eCommerceController');

// index route
router.get('/', eCommerceController.index);

// Route to fetch 10 random products
router.get('/random', eCommerceController.getRandomProducts);

// show route
router.get('/:slug', eCommerceController.show); // Adjusted route for fetching a single product

// Route to fetch products by macroarea
router.get('/macroarea/:slug', eCommerceController.getProductsByMacroarea);

// Route to fetch products by category
router.get('/category/:slug', eCommerceController.getProductsByCategory);

module.exports = router;