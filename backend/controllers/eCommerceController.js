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

function getCategories(req, res) {
    const sql = `
        SELECT 
            categories.id,
            categories.name,
            categories.slug
        FROM categories
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

// Create a new order - simplified approach
function createOrder(req, res) {
    const {
        customer_info, // Customer details for this specific order
        items,
        delivery,
        total,
        discount = 0
    } = req.body;

    // Validate required customer info
    if (!customer_info || !customer_info.email) {
        return res.status(400).json({ error: 'Customer email is required for orders' });
    }

    const { first_name, last_name, email, phone, address, city, state, postal_code, country } = customer_info;

    // Calculate final price
    const final_price = parseFloat(total) - parseFloat(discount) + parseFloat(delivery);

    // First create a User entry for this order (even if duplicate email)
    const userSql = `
        INSERT INTO Users (
            first_name, last_name, email, phone, 
            address, city, state, postal_code, country
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        userSql,
        [first_name, last_name, email, phone, address, city, state, postal_code, country],
        (err, userResults) => {
            if (err) {
                // If duplicate email error, create a unique order-specific user
                if (err.code === 'ER_DUP_ENTRY') {
                    // Add timestamp to ensure uniqueness
                    const uniqueEmail = `${email}_${Date.now()}`;

                    connection.query(
                        userSql,
                        [first_name, last_name, uniqueEmail, phone, address, city, state, postal_code, country],
                        handleUserCreation
                    );
                } else {
                    return res.status(500).json({ error: err.message });
                }
            } else {
                handleUserCreation(null, userResults);
            }
        }
    );

    function handleUserCreation(err, userResults) {
        if (err) return res.status(500).json({ error: err.message });

        const user_id = userResults.insertId;

        // Insert the order with the new user ID
        const orderSql = `
            INSERT INTO Orders (user_id, status, delivery, total, discount, final_price)
            VALUES (?, 'Pending', ?, ?, ?, ?)
        `;

        connection.query(orderSql, [user_id, delivery, total, discount, final_price], (err, orderResults) => {
            if (err) return res.status(500).json({ error: err.message });

            const order_id = orderResults.insertId;

            // Then insert all order items
            const orderItemsValues = items.map(item => [
                order_id,
                item.product_id,
                item.product_variation_id || null,
                item.quantity,
                item.price
            ]);

            const orderItemsSql = `
                INSERT INTO Order_Items (order_id, product_id, product_variation_id, quantity, price)
                VALUES ?
            `;

            connection.query(orderItemsSql, [orderItemsValues], (err) => {
                if (err) return res.status(500).json({ error: err.message });

                // Return the created order
                res.status(201).json({
                    message: 'Order created successfully',
                    order_id,
                    tracking_email: email
                });
            });
        });
    }
}

// Get a single order with its items and customer details
function getOrder(req, res) {
    const { id } = req.params;

    const sql = `
        SELECT 
            o.*,
            u.first_name, u.last_name, u.email, u.phone,
            u.address, u.city, u.state, u.postal_code, u.country,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'product_name', p.name,
                    'product_variation_id', oi.product_variation_id,
                    'color', pv.color,
                    'size', pv.size,
                    'quantity', oi.quantity,
                    'price', oi.price
                )
            ) AS items
        FROM Orders o
        JOIN Users u ON o.user_id = u.id
        JOIN Order_Items oi ON o.id = oi.order_id
        JOIN Products p ON oi.product_id = p.id
        LEFT JOIN Product_Variations pv ON oi.product_variation_id = pv.id
        WHERE o.id = ?
        GROUP BY o.id
    `;

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Order not found' });

        res.json(results[0]);
    });
}

// Track an order by email and order ID - modified to accommodate duplicate emails
function trackOrder(req, res) {
    const { email, order_id } = req.body;

    if (!email || !order_id) {
        return res.status(400).json({ error: 'Email and order ID are required for tracking' });
    }

    const sql = `
        SELECT 
            o.id,
            o.status,
            o.total,
            o.discount,
            o.final_price,
            o.created_at,
            o.updated_at,
            u.email,
            u.first_name,
            u.last_name
        FROM Orders o
        JOIN Users u ON o.user_id = u.id
        WHERE o.id = ? AND (u.email = ? OR u.email LIKE ?)
    `;

    // Search for both exact email and email_timestamp pattern
    const emailPattern = `${email}\\_%`;

    connection.query(sql, [order_id, email, emailPattern], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Order not found or email does not match' });

        res.json(results[0]);
    });
}

// Update order status
function updateOrderStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be one of: Pending, Processing, Completed, Cancelled' });
    }

    const sql = `
        UPDATE Orders
        SET status = ?
        WHERE id = ?
    `;

    connection.query(sql, [status, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });

        res.json({ message: 'Order status updated successfully' });
    });
}

// Function to get orders by email address
function getOrdersByEmail(req, res) {
    const { email } = req.params;

    const sql = `
        SELECT 
            o.id,
            o.status,
            o.total,
            o.discount,
            o.final_price,
            o.created_at,
            o.updated_at
        FROM Orders o
        JOIN Users u ON o.user_id = u.id
        WHERE u.email = ? OR u.email LIKE ?
        ORDER BY o.created_at DESC
    `;

    // Search for both exact email and email_timestamp pattern
    const emailPattern = `${email}\\_%`;

    connection.query(sql, [email, emailPattern], (err, results) => {
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
    getCategories,
    createOrder,
    getOrder,
    trackOrder,
    getOrdersByEmail,
    updateOrderStatus
};