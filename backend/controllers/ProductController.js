const connection = require('../database/db');

// Get all products
function getAllProducts(req, res) {
    const sql = `
        SELECT 
            p.id,
            p.slug,
            p.name,
            p.description,
            p.long_description,
            p.price,
            p.discount,
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
async function searchProducts(req, res) {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ success: false, message: 'Search query parameter (q) is required' });
        }

        const query = `
            SELECT p.*, c.name as category_name, c.slug as category_slug, m.name as macroarea_name, m.slug as macroarea_slug
            FROM Products p
            JOIN Categories c ON p.category_id = c.id
            JOIN Macroareas m ON c.macroarea_id = m.id
            WHERE p.name LIKE ? OR p.description LIKE ?
            ORDER BY p.name ASC
        `;

        connection.query(query, [`%${q}%`, `%${q}%`], (err, products) => {
            if (err) {
                console.error('Error searching products:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Server error while searching products'
                });
            }

            return res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        });
    } catch (error) {
        console.error('Error searching products:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while searching products'
        });
    }
}

module.exports = {
    getAllProducts,
    getProductBySlug,
    getRandomProducts,
    getDiscountedProducts,
    searchProducts
};