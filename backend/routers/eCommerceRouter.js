const express = require("express");
const router = express.Router();

// Import specialized routers
const productRouter = require('./productRouter');
const macroareaRouter = require('./categoryRouter');
const orderRouter = require('./orderRouter');
const newsletterRouter = require('./newsletterRouter');

// Set up routes by domain
router.use('/products', productRouter);
router.use('/macroareas', macroareaRouter);
router.use('/orders', orderRouter);
router.use('/newsletter', newsletterRouter);

// Legacy compatibility - redirect root to products
router.get('/', (req, res) => {
    const baseUrl = req.baseUrl || '';
    res.redirect(`${baseUrl}/products`);
});

module.exports = router;