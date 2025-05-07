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

/* index
http://localhost:3000/api/v1/products

index w/ macro_area (ONLY top, bottom or accessories)
http://localhost:3000/api/v1/products?macro_area=top

index w/ random products
http://localhost:3000/api/v1/products/random

index w/ category (slug)
http://localhost:3000/api/v1/products?category=outerwear

index w/ group_id
http://localhost:3000/api/v1/products?group_id=2

show
http://localhost:3000/api/v1/products/francois-overcoat-black



*/