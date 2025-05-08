const express = require("express");
const router = express.Router();
const eCommerceController = require('../controllers/eCommerceController');

// index route
router.get('/', eCommerceController.index);

// Route to fetch all categories
router.get('/categories', eCommerceController.getCategories);


// Route to fetch 10 random products
router.get('/random', eCommerceController.getRandomProducts);


// Route to fetch products by macroarea
router.get('/macroarea/:slug', eCommerceController.getProductsByMacroarea);

// Route to fetch products by category
router.get('/category/:slug', eCommerceController.getProductsByCategory);


// show route
router.get('/:slug', eCommerceController.show);


// Route to submit email for the newsletter
router.post('/email', eCommerceController.submitEmail);

// Order routes
router.post('/orders', eCommerceController.createOrder);
router.get('/orders/:id', eCommerceController.getOrder);
router.post('/orders/track', eCommerceController.trackOrder);
router.get('/orders/email/:email', eCommerceController.getOrdersByEmail);
router.patch('/orders/:id/status', eCommerceController.updateOrderStatus);

module.exports = router;