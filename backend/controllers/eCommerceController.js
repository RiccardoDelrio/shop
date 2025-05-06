const connection = require('../database/db')

function index(req, res) {
    const { macro_area, category } = req.query;

    let sql = `
        SELECT 
            products.id,
            products.name,
            products.description,
            products.price,
            products.color,
            products.size,
            products.discount,
            products.stock,
            products.image,
            categories.name AS category_name,
            categories.macro_area
        FROM products
        INNER JOIN categories ON products.category_id = categories.id
    `;

    const conditions = [];
    const params = [];

    // Add filters dynamically
    if (macro_area) {
        conditions.push('categories.macro_area = ?');
        params.push(macro_area);
    }
    if (category) {
        conditions.push('categories.slug = ?');
        params.push(category);
    }

    if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    connection.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
}

function show(req, res) {
    const { slug } = req.params;

    const sql = `
        SELECT 
            products.id,
            products.name,
            products.description,
            products.price,
            products.color,
            products.size,
            products.discount,
            products.stock,
            products.image,
            categories.name AS category_name,
            categories.macro_area
        FROM products
        INNER JOIN categories ON products.category_id = categories.id
        WHERE products.slug = ?
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(results[0]); // Return the first (and only) result
    });
}

module.exports = {
    index,
    show,
};