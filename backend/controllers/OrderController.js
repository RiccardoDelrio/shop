const connection = require('../database/db');

// Create a new order
async function createOrder(req, res) {
    const {
        customer_info,
        items,
        discount = 0
    } = req.body;

    // Validate required customer info
    if (!customer_info || !customer_info.email) {
        return res.status(400).json({ error: 'Customer email is required for orders' });
    }

    const { first_name, last_name, email, phone, address, city, state, postal_code, country } = customer_info;

    // Calculate total (sum of item.price * item.quantity), applying product-level discounts
    let total = 0;
    const itemsWithDiscount = await Promise.all(items.map(async item => {
        // Fetch product discount from DB
        const [rows] = await connection.promise().query(
            'SELECT discount FROM Products WHERE id = ?',
            [item.product_id]
        );
        const productDiscount = rows[0]?.discount || 0;
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity);
        const discountedPrice = productDiscount > 0 ? price - (price * productDiscount / 100) : price;
        total += discountedPrice * quantity;
        return {
            ...item,
            discountedPrice
        };
    }));
    // Calculate discount as a percentage (order-level)
    const discountAmount = total * (parseFloat(discount) / 100);
    // Calculate delivery: free if total >= 500, else 30
    const deliveryValue = total >= 500 ? '0' : '30'; // Ensure it's a string to match ENUM
    // Calculate final price
    const final_price = total - discountAmount + parseInt(deliveryValue);

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

        connection.query(orderSql, [user_id, deliveryValue, total, discount, final_price], (err, orderResults) => {
            if (err) return res.status(500).json({ error: err.message });

            const order_id = orderResults.insertId;

            // Then insert all order items
            const orderItemsValues = itemsWithDiscount.map(item => [
                order_id,
                item.product_id,
                item.product_variation_id || null,
                item.quantity,
                item.discountedPrice
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

// Get order by ID
function getOrderById(req, res) {
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

// Track order
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

        res.json({ message: `Order status updated successfully to ${status}` });
    });
}

// Get orders by email
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
    createOrder,
    getOrderById,
    trackOrder,
    updateOrderStatus,
    getOrdersByEmail
};