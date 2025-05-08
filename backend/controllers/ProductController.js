const connection = require('../database/db');

// Get all products
function getAllProducts(req, res) {
    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            products.discount,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'url', product_images.image_url,
                    'view_type', product_images.view_type,
                    'is_primary', product_images.is_primary
                )
            ) AS images
        FROM products
        LEFT JOIN product_images ON products.id = product_images.product_id
        GROUP BY products.id
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
}

// Get product by slug
function getProductBySlug(req, res) {
    const { slug } = req.params;
    const sql = `
        SELECT 
            p.id,
            p.slug,
            p.name,
            p.description,
            p.price,
            p.discount,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', pi.image_url,
                        'view_type', pi.view_type,
                        'is_primary', pi.is_primary,
                        'product_variation_id', pi.product_variation_id
                    )
                )
                FROM product_images pi 
                WHERE pi.product_id = p.id
            ) AS images,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', pv.id,
                    'color', pv.color,
                    'size', pv.size,
                    'stock', pv.stock,
                    'additional_price', pv.additional_price
                )
            ) AS variations
        FROM products p
        LEFT JOIN product_variations pv ON p.id = pv.product_id
        WHERE p.slug = ?
        GROUP BY p.id
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Product not found' });

        res.json(results[0]);
    });
}

// Get random products
function getRandomProducts(req, res) {
    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            products.discount,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', pi.image_url,
                        'view_type', pi.view_type,
                        'is_primary', pi.is_primary,
                        'product_variation_id', pi.product_variation_id
                    )
                )
                FROM product_images pi 
                WHERE pi.product_id = products.id
            ) AS images
        FROM products
        GROUP BY products.id
        ORDER BY RAND()
        LIMIT 10
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
}

// Get discounted products
function getDiscountedProducts(req, res) {
    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            products.discount,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', pi.image_url,
                        'view_type', pi.view_type,
                        'is_primary', pi.is_primary,
                        'product_variation_id', pi.product_variation_id
                    )
                )
                FROM product_images pi 
                WHERE pi.product_id = products.id
            ) AS images
        FROM products
        WHERE products.discount > 0
        GROUP BY products.id
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.json([]);

        res.json(results);
    });
}

module.exports = {
    getAllProducts,
    getProductBySlug,
    getRandomProducts,
    getDiscountedProducts
};