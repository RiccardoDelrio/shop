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

*/