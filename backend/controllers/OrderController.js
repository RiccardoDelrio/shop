const connection = require('../database/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'alta_moda_shop_super_secret_key';

// Funzione di utilità per generare una password casuale
function generateRandomPassword(length = 8) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

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

    const { first_name, last_name, email, phone, address, city, state, postal_code, country, is_guest } = customer_info;

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

    // Check if token was provided to identify already logged in users
    const authHeader = req.headers['authorization'];
    let user_id = null; if (authHeader && !is_guest) {
        try {
            const token = authHeader.split(' ')[1];
            // Properly decode the JWT token to get user information
            const decoded = jwt.verify(token, JWT_SECRET);

            if (decoded && decoded.user_id) {
                user_id = decoded.user_id;                // Verify that this user exists and get their data
                const [userRows] = await connection.promise().query(
                    'SELECT id, email, first_name, last_name, phone, address, city, state, postal_code, country FROM Users WHERE id = ?',
                    [user_id]
                );

                if (userRows.length === 0) {
                    // User not found - proceed as guest
                    user_id = null;
                } else {
                    // Se l'email nell'ordine non corrisponde all'utente, usa quella dell'utente
                    if (userRows[0].email !== email) {
                        // Sovrascrive i dati dell'ordine con i dati utente se è stato trovato
                        const userData = userRows[0];
                        // Aggiorna i dati del cliente con quelli dell'utente loggato se non sono stati forniti
                        if (userData.first_name) first_name = first_name || userData.first_name;
                        if (userData.last_name) last_name = last_name || userData.last_name;
                        if (userData.email) email = userData.email; // Usa sempre l'email dell'utente loggato
                        if (userData.phone) phone = phone || userData.phone;
                        if (userData.address) address = address || userData.address;
                        if (userData.city) city = city || userData.city;
                        if (userData.state) state = state || userData.state;
                        if (userData.postal_code) postal_code = postal_code || userData.postal_code;
                        if (userData.country) country = country || userData.country;
                    }
                }
            }
        } catch (err) {
            console.error("Error validating user token:", err);
            // Continue with guest process if token validation fails
            user_id = null;
        }
    }

    // Try to find user by email if token validation failed
    if (!user_id && email) {
        try {
            const [userRows] = await connection.promise().query(
                'SELECT id FROM Users WHERE email = ?',
                [email]
            );

            if (userRows.length > 0) {
                user_id = userRows[0].id;
            }
        } catch (err) {
            console.error("Error finding user by email:", err);
        }
    }    // If we have an authenticated user, proceed directly to order creation
    if (user_id) {
        createOrderForUser(user_id);
    } else {
        // Altrimenti crea un nuovo utente con password casuale
        const password = customer_info.password || generateRandomPassword();

        // Hash della password
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: 'Errore nella generazione della password: ' + err.message });            // Crea nuovo utente con la password hashata
            const userSql = `
                INSERT INTO Users (
                    first_name, last_name, email, phone, 
                    address, city, state, postal_code, country, password, role
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '${is_guest ? 'guest' : 'customer'}')
            `;

            connection.query(
                userSql,
                [first_name, last_name, email, phone, address, city, state, postal_code, country, hashedPassword],
                (err, userResults) => {
                    if (err) {
                        // Se email duplicata, crea un utente specifico per l'ordine
                        if (err.code === 'ER_DUP_ENTRY') {                            // Aggiungi timestamp per garantire l'unicità
                            const uniqueEmail = `${email}_${Date.now()}`;
                            // Rigenera la query SQL per assicurarsi che venga usato il ruolo corretto
                            const uniqueUserSql = `
                                INSERT INTO Users (
                                    first_name, last_name, email, phone, 
                                    address, city, state, postal_code, country, password, role
                                )
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '${is_guest ? 'guest' : 'customer'}')
                            `;
                            connection.query(
                                uniqueUserSql,
                                [first_name, last_name, uniqueEmail, phone, address, city, state, postal_code, country, hashedPassword],
                                (err, results) => {
                                    if (err) return res.status(500).json({ error: err.message });
                                    createOrderForUser(results.insertId);
                                }
                            );
                        } else {
                            return res.status(500).json({ error: err.message });
                        }
                    } else {
                        createOrderForUser(userResults.insertId);
                    }
                }
            );
        });
    }

    function createOrderForUser(user_id) {
        // Insert the order with the user ID
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



/**
 * Ottiene tutti gli ordini dell'utente specificato tramite ID
 */
function getUserOrders(req, res) {
    // Ottieni l'ID utente direttamente dai parametri dell'URL
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({
            success: false,
            error: 'ID utente mancante'
        });
    }

    // Query per ottenere tutti gli ordini dell'utente con i relativi items
    const sql = `
        SELECT 
            o.id,
            o.status,
            o.total,
            o.discount,
            o.delivery,
            o.final_price,
            o.created_at,
            o.updated_at,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'product_name', p.name,
                    'product_variation_id', oi.product_variation_id,
                    'color', pv.color,
                    'size', pv.size,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'image', (SELECT pi.image_url FROM Product_Images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1)
                )
            ) AS items
        FROM Orders o
        JOIN Order_Items oi ON o.id = oi.order_id
        JOIN Products p ON oi.product_id = p.id
        LEFT JOIN Product_Variations pv ON oi.product_variation_id = pv.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;

    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Errore nel recupero degli ordini:', err);
            return res.status(500).json({
                success: false,
                error: 'Errore durante il recupero degli ordini'
            });
        }

        // Formatta il risultato per ciascun ordine
        const formattedResults = results.map(order => {
            // Se items è una stringa (può succedere con JSON_ARRAYAGG), convertiamo in array
            let items = order.items;
            if (typeof items === 'string') {
                try {
                    items = JSON.parse(items);
                } catch {
                    items = [];
                }
            }

            return {
                ...order,
                items
            };
        });

        res.status(200).json({
            success: true,
            count: formattedResults.length,
            orders: formattedResults
        });
    });
}

// Get orders by email
function getOrdersByEmail(req, res) {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const sql = `
        SELECT 
            o.id,
            o.status,
            o.total,
            o.discount,
            o.delivery,
            o.final_price,
            o.created_at,
            o.updated_at,
            u.email,
            u.first_name,
            u.last_name,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'product_name', p.name,
                    'product_variation_id', oi.product_variation_id,
                    'quantity', oi.quantity,
                    'price', oi.price
                )
            ) AS items
        FROM Orders o
        JOIN Users u ON o.user_id = u.id
        JOIN Order_Items oi ON o.id = oi.order_id
        JOIN Products p ON oi.product_id = p.id
        WHERE u.email = ? OR u.email LIKE ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;

    // Search for both exact email and email_timestamp pattern
    const emailPattern = `${email}\\_%`;

    connection.query(sql, [email, emailPattern], (err, results) => {
        if (err) {
            console.error('Error retrieving orders:', err);
            return res.status(500).json({
                success: false,
                error: 'Error retrieving orders'
            });
        }

        // Format the results for each order
        const formattedResults = results.map(order => {
            // If items is a string (can happen with JSON_ARRAYAGG), convert to array
            let items = order.items;
            if (typeof items === 'string') {
                try {
                    items = JSON.parse(items);
                } catch {
                    items = [];
                }
            }

            return {
                ...order,
                items
            };
        });

        res.status(200).json({
            success: true,
            count: formattedResults.length,
            orders: formattedResults
        });
    });
}

module.exports = {
    createOrder,
    getOrderById,
    trackOrder,
    updateOrderStatus,
    getOrdersByEmail,
    getUserOrders,
};