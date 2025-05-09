const connection = require('../database/db');

// Get all categories
function getAllCategories(req, res) {
    const sql = `
        SELECT 
            categories.id,
            categories.name,
            categories.slug,
            categories.description,
            categories.macroarea_id,
            macroareas.name as macroarea_name,
            macroareas.slug as macroarea_slug
        FROM categories
        JOIN macroareas ON categories.macroarea_id = macroareas.id
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

// Get all macroareas with their categories
function getAllMacroareas(req, res) {
    const sql = `
        SELECT 
            macroareas.id,
            macroareas.name,
            macroareas.slug,
            macroareas.description,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', c.id,
                        'name', c.name,
                        'slug', c.slug,
                        'description', c.description
                    )
                )
                FROM categories c
                WHERE c.macroarea_id = macroareas.id
            ) AS categories
        FROM macroareas
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Parse the JSON string to an actual array for each macroarea
        results.forEach(macroarea => {
            if (typeof macroarea.categories === 'string') {
                try {
                    macroarea.categories = JSON.parse(macroarea.categories);
                } catch (e) {
                    macroarea.categories = [];
                }
            } else if (!macroarea.categories) {
                macroarea.categories = [];
            }
        });

        res.json(results);
    });
}

// Get products by macroarea
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
            products.discount,
            categories.id AS category_id,
            categories.name AS category_name,
            categories.slug AS category_slug,
            macroareas.id AS macroarea_id,
            macroareas.name AS macroarea_name,
            macroareas.slug AS macroarea_slug,
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
        JOIN categories ON products.category_id = categories.id
        JOIN macroareas ON categories.macroarea_id = macroareas.id
        WHERE macroareas.slug = ?
        GROUP BY products.id
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: `No products found for macroarea: ${slug}` });

        // Parse the JSON string to an actual array for each product
        results.forEach(product => {
            if (product.images) {
                product.images = JSON.parse(product.images);
            } else {
                product.images = [];
            }
        });

        res.json(results);
    });
}

// Get products by category
function getProductsByCategory(req, res) {
    const { slug } = req.params;

    // Validate the slug parameter
    if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Invalid category slug provided' });
    }

    const sql = `
        SELECT 
            products.id,
            products.slug,
            products.name,
            products.description,
            products.price,
            products.discount,
            categories.id AS category_id,
            categories.name AS category_name,
            categories.slug AS category_slug,
            macroareas.id AS macroarea_id,
            macroareas.name AS macroarea_name,
            macroareas.slug AS macroarea_slug,
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
        JOIN categories ON products.category_id = categories.id
        JOIN macroareas ON categories.macroarea_id = macroareas.id
        WHERE categories.slug = ?
        GROUP BY products.id
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: `No products found for category: ${slug}` });

        // Parse the JSON string to an actual array for each product
        results.forEach(product => {
            if (product.images) {
                product.images = JSON.parse(product.images);
            } else {
                product.images = [];
            }
        });

        res.json(results);
    });
}

// Get categories by macroarea
function getCategoriesByMacroarea(req, res) {
    const { slug } = req.params;

    // Validate the slug parameter
    if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Invalid macroarea slug provided' });
    }

    const sql = `
        SELECT 
            categories.id,
            categories.name,
            categories.slug,
            categories.description,
            macroareas.id AS macroarea_id,
            macroareas.name AS macroarea_name,
            macroareas.slug AS macroarea_slug
        FROM categories
        JOIN macroareas ON categories.macroarea_id = macroareas.id
        WHERE macroareas.slug = ?
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: `No categories found for macroarea: ${slug}` });

        res.json(results);
    });
}

module.exports = {
    getAllCategories,
    getAllMacroareas,
    getProductsByMacroarea,
    getProductsByCategory,
    getCategoriesByMacroarea
};