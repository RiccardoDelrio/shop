const connection = require('../database/db')

function index(req, res) {
    const sql = `
        SELECT 
        products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            products.image
        FROM products
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
}

function getRandomProducts(req, res) {
    const sql = `
        SELECT 
        products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            products.image
        FROM products
        ORDER BY RAND()
        LIMIT 10
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
}

function show(req, res) {
    const { slug } = req.params;
    const sql = `
        SELECT 
        products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            products.image,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', product_variations.id,
                    'color', product_variations.color,
                    'size', product_variations.size,
                    'stock', product_variations.stock
                )
            ) AS variations
        FROM products
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

function getProductsByMacroarea(req, res) {
    const { slug } = req.params;
    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            products.image
        FROM products
        JOIN categories ON products.category_id = categories.id
        JOIN macroareas ON categories.macroarea_id = macroareas.id
        WHERE macroareas.slug = ?
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

function getProductsByCategory(req, res) {
    const { slug } = req.params;
    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            products.image
        FROM products
        JOIN categories ON products.category_id = categories.id
        WHERE categories.slug = ?
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

function getCategories(req, res) {
    const sql = `
        SELECT 
            categories.name,
        FROM categories
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

module.exports = {
    index,
    show,
    getRandomProducts, // Export the new function
    getProductsByCategory,
    getProductsByMacroarea,
    getCategories, // Esportare la nuova funzione
};