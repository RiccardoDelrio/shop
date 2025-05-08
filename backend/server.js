const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
const eCommerceRouter = require('./routers/eCommerceRouter')
const notFound = require('./middlewares/notFound')
const serverError = require('./middlewares/serverError')
const validateQuery = require('./middlewares/validateQuery');

const cors = require("cors");
app.use(cors({ origin: process.env.FRONT_URL || 'http://localhost:5173' }));

app.use(express.static('public'));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello motherfuckers!');
});

// Apply query validation globally
app.use(validateQuery);

app.use('/api/v1/products', eCommerceRouter)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})


// Catch-all for undefined routes
app.use(notFound);

// Error handling middleware
app.use(serverError);

/* 

// index
http://localhost:3000/api/v1/products

// get all the categories
http://localhost:3000/api/v1/products/categories

// index filter w/ macro_area (upper-body, lower-body, dress, accessori)
http://localhost:3000/api/v1/products/macroarea/upper-body

// index filter w/ category (slug) (orecchini, bracciali, collane, giacche, cappotti, maglie, maglioni, pantaloni, gonne, vestitini)
http://localhost:3000/api/v1/products/category/orecchini


// show w/ slug
http://localhost:3000/api/v1/products/cappotto-lana-pregiata


// create email (POST ONLY!)
http://localhost:3000/api/v1/products/email


// 10 random products
http://localhost:3000/api/v1/products/random


// orders routes
    // CREATE AN ORDER
        POST http://localhost:3000/api/v1/products/orders

        EXAMPLE BODY:
        {
        "customer_info": {
            "first_name": "Elizabeth",
            "last_name": "Swann",
            "email": "elizabeth@blackpearl.com",
            "phone": "555-123-4567",
            "address": "23 Pearl Street",
            "city": "Port Royal",
            "state": "Caribbean",
            "postal_code": "12345",
            "country": "Jamaica"
        },
        "items": [
            {
            "product_id": 1,
            "product_variation_id": 4,
            "quantity": 1,
            "price": 1200.00
            },
            {
            "product_id": 2,
            "product_variation_id": null,
            "quantity": 2,
            "price": 150.00
            }
        ],
        "delivery": 15.00,
        "total": 1500.00,
        "discount": 50.00
        }

    // DISPLAY ALL DETAILS OF ONE ORDER WITH ORDER ID (admin-side)
        GET http://localhost:3000/api/v1/products/orders/:id

    // DISPLAY SUMMARY OF THE ORDER BY USING MAIL AND ORDER_ID (client-side)
        POST http://localhost:3000/api/v1/products/orders/track
        
        EXAMPLE BODY:
        {
            "email": "elizabeth@blackpearl.com",
            "order_id": 1
        }
    
    // RETRIEVE ALL ORDERS ASSOCIATED WITH THE SAME EMAIL
        GET http://localhost:3000/api/v1/products/orders/email/:email

    // UPDATE STATUS OF THE ORDER (admin-side) (Pending, Processing, Completed, Cancelled)
        PATCH http://localhost:3000/api/v1/products/orders/:id/status

        EXAMPLE BODY:
        {
            "status": "Processing"  
        }
*/