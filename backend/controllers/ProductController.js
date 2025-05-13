const connection = require('../database/db');

// Get all products
function getAllProducts(req, res) {
    const sql = `
        SELECT 
            p.id,
            p.slug,
            p.name,            p.description,
            p.long_description,
            p.price,
            p.discount,
            p.created_at,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'url', pi.image_url,
                    'view_type', pi.view_type,
                    'is_primary', pi.is_primary
                )
            ) AS images
        FROM Products p
        LEFT JOIN Product_Images pi ON p.id = pi.product_id
        GROUP BY p.id
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
            p.long_description,
            p.price,
            p.discount,
            p.created_at,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', pi.image_url,
                        'view_type', pi.view_type,
                        'is_primary', pi.is_primary,
                        'product_variation_id', pi.product_variation_id
                    )
                )
                FROM Product_Images pi 
                WHERE pi.product_id = p.id
            ) AS images,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', pv.id,
                    'color', pv.color,
                    'color_hex', pv.color_hex,
                    'size', pv.size,
                    'stock', pv.stock
                )
            ) AS variations
        FROM Products p
        LEFT JOIN Product_Variations pv ON p.id = pv.product_id
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
            p.id,
            p.slug,
            p.name,
            p.description,
            p.long_description,
            p.price,
            p.discount,
            p.created_at,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', pi.image_url,
                        'view_type', pi.view_type,
                        'is_primary', pi.is_primary,
                        'product_variation_id', pi.product_variation_id
                    )
                )
                FROM Product_Images pi 
                WHERE pi.product_id = p.id
            ) AS images
        FROM Products p
        GROUP BY p.id
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
            p.id,
            p.slug,
            p.name,
            p.description,
            p.long_description,
            p.price,
            p.discount,
            p.created_at,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', pi.image_url,
                        'view_type', pi.view_type,
                        'is_primary', pi.is_primary,
                        'product_variation_id', pi.product_variation_id
                    )
                )
                FROM Product_Images pi 
                WHERE pi.product_id = p.id
            ) AS images
        FROM Products p
        WHERE p.discount > 0
        GROUP BY p.id
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.json([]);

        res.json(results);
    });
}

// Search products

function searchProducts(req, res) {
    const { query } = req.query;
    console.log(query, "query");
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const sql = `
        SELECT 
            p.id,
            p.slug,
            p.name,
            p.description,
            p.long_description,
            p.price,
            p.discount,
            p.created_at,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', pi.image_url,
                        'view_type', pi.view_type,
                        'is_primary', pi.is_primary,
                        'product_variation_id', pi.product_variation_id
                    )
                )
                FROM Product_Images pi 
                WHERE pi.product_id = p.id
            ) AS images
        FROM Products p
        WHERE p.name LIKE ? OR p.description LIKE ?
        GROUP BY p.id
    `;

    connection.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.json([]);

        res.json(results);
    });
}

// Get bestseller products
function getBestsellers(req, res) {
    const sql = `
 SELECT 
            p.id,
            p.slug,
            p.name,
            p.description,
            p.long_description,
            p.price,
            p.discount,
            p.created_at,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'url', pi.image_url,
                        'view_type', pi.view_type,
                        'is_primary', pi.is_primary,
                        'product_variation_id', pi.product_variation_id
                    )
                )
                FROM Product_Images pi 
                WHERE pi.product_id = p.id
            ) AS images
        FROM Products p
        INNER JOIN Bestseller_Products b ON p.id = b.product_id
        GROUP BY p.id
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
}

module.exports = {
    getAllProducts,
    getProductBySlug,
    getRandomProducts,
    getDiscountedProducts,
    searchProducts,
    getBestsellers
};