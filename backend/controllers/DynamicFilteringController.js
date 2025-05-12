const connection = require('../database/db');

function dynamicFiltering(req, res) {

    // whitelist to avoid sql injections
    const ALLOWED_FILTERS = [
        'category', 'wardrobe_section', 'color', 'size', 'discounted', 'search', 'minPrice', 'maxPrice', 'inStock'
    ];

    // check if the filters are in the whitelist 
    const isValidFilter = (filter) => ALLOWED_FILTERS.includes(filter);

    // Check if the filters are valid and create the filters object
    const filters = {};
    Object.keys(req.query).forEach(key => {
        if (isValidFilter(key)) {
            filters[key] = req.query[key];
        }
    });

    // Check for invalid filters and return an error
    const invalidFilters = Object.keys(req.query).filter(key => !isValidFilter(key) && key !== 'sort' && key !== 'limit');
    if (invalidFilters.length > 0) {
        return res.status(400).json({ error: `Invalid filters: ${invalidFilters.join(', ')}` });
    }

    let sql = `
  SELECT 
    p.id, p.slug, p.name, p.description, p.long_description, p.price, p.discount,
    c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
    WS.id AS wardrobe_section_id, WS.name AS wardrobe_section_name, WS.slug AS wardrobe_section_slug,
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
        'stock', pv.stock
      )
    ) AS variations
  FROM products p
  JOIN categories c ON p.category_id = c.id
  JOIN Wardrobe_Section WS ON c.wardrobe_section_id = WS.id
  LEFT JOIN product_variations pv ON p.id = pv.product_id
  WHERE 1=1
`;

    const params = [];

    if (filters.category) {
        sql += ' AND c.slug = ?';
        params.push(filters.category);
    }
    if (filters.wardrobe_section) {
        sql += ' AND WS.slug = ?';
        params.push(filters.wardrobe_section);
    }
    if (filters.color) {
        sql += ' AND pv.color = ?';
        params.push(filters.color);
    }
    if (filters.size) {
        sql += ' AND pv.size = ?';
        params.push(filters.size);
    }
    if (filters.discounted === 'true') {
        sql += ' AND p.discount > 0';
    }
    if (filters.inStock === 'true') {
        sql += ' AND pv.stock > 0';
    }
    if (filters.search) {
        sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
        params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    if (filters.minPrice) {
        sql += ' AND p.price >= ?';
        params.push(Number(filters.minPrice));
    }
    if (filters.maxPrice) {
        sql += ' AND p.price <= ?';
        params.push(Number(filters.maxPrice));
    }
    sql += ' GROUP BY p.id';

    // Optional: Sorting and limiting
    if (req.query.sort === 'price_desc') sql += ' ORDER BY p.price DESC';
    if (req.query.sort === 'price_asc') sql += ' ORDER BY p.price ASC';
    if (req.query.sort === 'discount_desc') sql += ' ORDER BY p.discount DESC';
    if (req.query.sort === 'discount_asc') sql += ' ORDER BY p.discount ASC';
    if (req.query.limit) {
        sql += ' LIMIT ?';
        params.push(Number(req.query.limit));
    }

    connection.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        // Parse images/variations JSON if needed
        results.forEach(product => {
            if (typeof product.images === 'string') {
                try { product.images = JSON.parse(product.images); } catch { product.images = []; }
            }
            if (typeof product.variations === 'string') {
                try { product.variations = JSON.parse(product.variations); } catch { product.variations = []; }
            }
        });
        res.json(results);
    });

}

module.exports = {
    dynamicFiltering,
};