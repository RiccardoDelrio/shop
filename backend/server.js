const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
const eCommerceRouter = require('./routers/eCommerceRouter')
const notFound = require('./middlewares/notFound')
const serverError = require('./middlewares/serverError')

const cors = require("cors");
app.use(cors({ origin: process.env.FRONT_URL || 'http://localhost:5173' }));

app.use(express.static('public'));
app.use(express.json());

// Home page route
app.get('/', (req, res) => {
    res.send('Boolean Shop API - Welcome to our e-commerce API');
});

// API Routes
app.use('/api/v1', eCommerceRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/v1`);
})

// Catch-all for undefined routes
app.use(notFound);

// Error handling middleware
app.use(serverError);

/**
 * API ENDPOINT REFERENCE (RESTful, slug-based)
 *
 * MACROAREAS
 * GET /api/v1/macroareas                  - All macroareas with their categories
 * GET /api/v1/macroareas/:slug/categories - Categories for a macroarea (by slug)
 * GET /api/v1/macroareas/:slug/products   - All products for a macroarea (by slug)
 *
 * CATEGORIES
 * GET /api/v1/categories                  - All categories (flat list)
 * GET /api/v1/categories/:slug            - All products for a category (by slug)
 *
 * PRODUCTS
 * GET /api/v1/products                    - All products
 * GET /api/v1/products/:slug              - Product details (by slug)
 * GET /api/v1/products/random             - Random products
 * GET /api/v1/products/discounted         - All discounted products
 * GET /api/v1/products/search?q=...       - Search products
 *
 * ORDERS
 * POST /api/v1/orders                     - Create order
 * GET /api/v1/orders/:id                  - Order details (by id)
 * PATCH /api/v1/orders/:id/status         - Update order status
 * POST /api/v1/orders/track               - Track order
 * GET /api/v1/orders/email/:email         - Orders by email
 *
 * NEWSLETTER
 * POST /api/v1/newsletter/subscribe       - Subscribe
 * DELETE /api/v1/newsletter/unsubscribe/:email - Unsubscribe
 */