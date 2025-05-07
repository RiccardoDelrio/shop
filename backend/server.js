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

app.get('/', (req, res) => {
    res.send('Hello motherfuckers!');
});

app.use('/api/v1/products', eCommerceRouter)

app.use(notFound);
app.use(serverError);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

/* 

// index
http://localhost:3000/api/v1/products

// index filter w/ macro_area (upper-body, lower-body, dress, accessori)
http://localhost:3000/api/v1/products?macro_area=top

// index filter w/ category (slug) (orecchini, bracciali, collane, giacche, cappotti, maglie, maglioni, pantaloni, gonne, vestitini)
http://localhost:3000/api/v1/products?category=outerwear


// show w/ slug
http://localhost:3000/api/v1/products/cappotto-lana


// create email (POST ONLY!)
http://localhost:3000/api/v1/products/email


// 10 random products
http://localhost:3000/api/v1/products/random

*/