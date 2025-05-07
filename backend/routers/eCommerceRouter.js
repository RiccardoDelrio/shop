const express = require("express");
const router = express.Router();
const eCommerceController = require('../controllers/eCommerceController');

// index route
router.get('/', eCommerceController.index);

// Route to fetch all categories
router.get('/categories', eCommerceController.getCategories);

// Route to fetch products by macroarea
router.get('/macroarea/:slug', eCommerceController.getProductsByMacroarea);

// Route to fetch products by category
router.get('/category/:slug', eCommerceController.getProductsByCategory);


// show route
router.get('/:slug', eCommerceController.show);


// Route to submit email for the newsletter
router.post('/email', eCommerceController.submitEmail);


// Route to fetch 10 random products
router.get('/random', eCommerceController.getRandomProducts);

module.exports = router;