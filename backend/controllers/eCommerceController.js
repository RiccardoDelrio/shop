const connection = require('../database/db');

// index
function index(req, res) {
    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            JSON_ARRAYAGG(product_images.image_url) AS images
        FROM products
        LEFT JOIN product_images ON products.id = product_images.product_id
        GROUP BY products.id
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
}

// show
function show(req, res) {
    const { slug } = req.params;
    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            JSON_ARRAYAGG(product_images.image_url) AS images,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', product_variations.id,
                    'color', product_variations.color,
                    'size', product_variations.size,
                    'stock', product_variations.stock
                )
            ) AS variations
        FROM products
        LEFT JOIN product_images ON products.id = product_images.product_id
        LEFT JOIN product_variations ON products.id = product_variations.product_id
        WHERE products.slug = ?
        GROUP BY products.id
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Product not found' });

        res.json(results[0]);
    });
}

// index filter functions
function getProductsByMacroarea(req, res) {
    const { slug } = req.params;

    // Validate the slug parameter
    if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Invalid macroarea slug provided' });
    }

    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            JSON_ARRAYAGG(product_images.image_url) AS images
        FROM products
        JOIN categories ON products.category_id = categories.id
        JOIN macroareas ON categories.macroarea_id = macroareas.id
        LEFT JOIN product_images ON products.id = product_images.product_id
        WHERE macroareas.slug = ?
        GROUP BY products.id
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: `No products found for macroarea: ${slug}` });

        res.json(results);
    });
}

function getProductsByCategory(req, res) {
    const { slug } = req.params;

    // Validate the slug parameter
    if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: `No products found for macroarea: ${slug}. Please check the macroarea slug and try again.` });
    }

    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            JSON_ARRAYAGG(product_images.image_url) AS images
        FROM products
        JOIN categories ON products.category_id = categories.id
        LEFT JOIN product_images ON products.id = product_images.product_id
        WHERE categories.slug = ?
        GROUP BY products.id
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: `No products found for category: ${slug}. Please check the category slug and try again.` });

        res.json(results);
    });
}

// Create new email for the newsletter list
function submitEmail(req, res) {
    const { email } = req.body;

    const sql = `
        INSERT INTO email_newsletter (email)
        VALUES (?)
    `;

    connection.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ message: 'e-mail added successfully!', reviewId: results.insertId });
    });
}

// get random products
function getRandomProducts(req, res) {
    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            JSON_ARRAYAGG(product_images.image_url) AS images
        FROM products
        LEFT JOIN product_images ON products.id = product_images.product_id
        GROUP BY products.id
        ORDER BY RAND()
        LIMIT 10
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
}

module.exports = {
    index,
    show,
    getProductsByCategory,
    getProductsByMacroarea,
    submitEmail,
    getRandomProducts,
};