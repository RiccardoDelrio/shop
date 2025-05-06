const express = require("express")
const router = express.Router()
const eCommerceController = require('../controllers/eCommerceController')

// index route
router.get('/', eCommerceController.index);

// show route
router.get('/:slug', eCommerceController.show);

module.exports = router;