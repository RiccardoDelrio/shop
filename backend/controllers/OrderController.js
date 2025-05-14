const connection = require("../database/db");
const sendEmail = require("../utils/sendEmail");
// Add the new utility instead of the encoder
const { generateNumericId, extractDatabaseId } = require("../utils/numericIdGenerator");

// Create a new order
async function createOrder(req, res) {
  const { customer_info, items, discount = 0 } = req.body;

  // Validate required customer info
  if (!customer_info || !customer_info.email) {
    return res
      .status(400)
      .json({ error: "Customer email is required for orders" });
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    state,
    postal_code,
    country,
  } = customer_info;

  // Calculate total (sum of item.price * item.quantity), applying product-level discounts
  let total = 0;
  const itemsWithDiscount = await Promise.all(
    items.map(async (item) => {
      // Fetch product discount from DB
      const [rows] = await connection
        .promise()
        .query("SELECT discount, name FROM Products WHERE id = ?", [item.product_id]);
      const productDiscount = rows[0]?.discount || 0;
      const productName = rows[0]?.name;
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      const discountedPrice =
        productDiscount > 0 ? price - (price * productDiscount) / 100 : price;
      total += discountedPrice * quantity;
      return {
        ...item,
        discountedPrice,
        name: productName || item.name // Use DB name or fallback to provided name
      };
    })
  );
  // Calculate discount as a percentage (order-level)
  const discountAmount = total * (parseFloat(discount) / 100);
  // Calculate delivery: free if total >= 500, else 30
  const deliveryValue = total >= 500 ? "0" : "30"; // Ensure it's a string to match ENUM
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
    [
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      state,
      postal_code,
      country,
    ],
    (err, userResults) => {
      if (err) {
        // If duplicate email error, create a unique order-specific user
        if (err.code === "ER_DUP_ENTRY") {
          // Add timestamp to ensure uniqueness
          const uniqueEmail = `${email}_${Date.now()}`;

          connection.query(
            userSql,
            [
              first_name,
              last_name,
              uniqueEmail,
              phone,
              address,
              city,
              state,
              postal_code,
              country,
            ],
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

    connection.query(
      orderSql,
      [user_id, deliveryValue, total, discount, final_price],
      (err, orderResults) => {
        if (err) return res.status(500).json({ error: err.message });

        const order_id = orderResults.insertId;
        // Generate a numeric customer-facing ID instead of encoding
        const numericOrderId = generateNumericId(order_id);

        // Then insert all order items
        const orderItemsValues = itemsWithDiscount.map((item) => [
          order_id,
          item.product_id,
          item.product_variation_id || null,
          item.quantity,
          item.discountedPrice,
        ]);

        const orderItemsSql = `
                INSERT INTO Order_Items (order_id, product_id, product_variation_id, quantity, price)
                VALUES ?
            `;

        connection.query(orderItemsSql, [orderItemsValues], async (err) => {
          if (err) return res.status(500).json({ error: err.message });

          try {
            // Prepara il riepilogo degli articoli
            const itemsSummary = itemsWithDiscount
              .map(
                (item) =>
                  `<tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name || `Prodotto #${item.product_id}`}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€${item.discountedPrice.toFixed(2)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€${(item.discountedPrice * item.quantity).toFixed(2)}</td>
                  </tr>`
              )
              .join("");

            // Email al cliente - use numeric ID in emails
            await sendEmail(
              email,
              `Order Confirmation #${numericOrderId} - Boolean Shop`,
              `<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px; padding: 20px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 4px;">
                  <h1 style="color: #333; margin: 0;">Order Confirmation</h1>
                  <p style="font-size: 18px; color: #666; margin: 5px 0 0 0;">Order #${numericOrderId}</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                  <h2 style="color: #444; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Dear ${first_name} ${last_name},</h2>
                  <p style="color: #555; font-size: 16px;">Thank you for your order! We're processing it right away and will notify you when it ships.</p>
                </div>
                
                <div style="background-color: #f9f9f9; border-radius: 4px; padding: 15px; margin-bottom: 25px;">
                  <h3 style="color: #444; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Summary</h3>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <thead>
                      <tr style="background-color: #f0f0f0;">
                        <th style="padding: 10px; text-align: left;">Item</th>
                        <th style="padding: 10px; text-align: right;">Unit Price</th>
                        <th style="padding: 10px; text-align: right;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsSummary}
                    </tbody>
                  </table>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                      <td style="padding: 5px; text-align: right;">Subtotal:</td>
                      <td style="padding: 5px; text-align: right; width: 100px;">€${total.toFixed(2)}</td>
                    </tr>
                    ${discount > 0 ? `
                    <tr>
                      <td style="padding: 5px; text-align: right;">Discount (${discount}%):</td>
                      <td style="padding: 5px; text-align: right; color: #c00;">-€${discountAmount.toFixed(2)}</td>
                    </tr>` : ''}
                    <tr>
                      <td style="padding: 5px; text-align: right;">Shipping:</td>
                      <td style="padding: 5px; text-align: right;">€${deliveryValue}</td>
                    </tr>
                    <tr style="font-weight: bold; font-size: 16px;">
                      <td style="padding: 10px 5px; text-align: right; border-top: 2px solid #eee;">Total:</td>
                      <td style="padding: 10px 5px; text-align: right; border-top: 2px solid #eee;">€${final_price.toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 10px;">Shipping Address</h3>
                  <p style="color: #555; margin-left: 15px;">
                    ${address}<br>
                    ${postal_code} ${city}<br>
                    ${state}, ${country}
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0 20px;">
                  <a href="http://localhost:5173/track-order?email=${email}&order=${numericOrderId}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Track Your Order</a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 14px;">
                  <p>Best regards,<br>
                  The Boolean Shop Team</p>
                  <p style="font-size: 12px; color: #999; margin-top: 20px;">© ${new Date().getFullYear()} Boolean Shop. All rights reserved.</p>
                </div>
              </div>`
            );

            // Email al venditore - use numeric ID in emails
            await sendEmail(
              process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
              `New Order #${numericOrderId}`,
              `<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px; padding: 20px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px; padding: 20px; background-color: #f0f7ff; border-radius: 4px;">
                  <h2 style="color: #0066cc; margin: 0;">New Order Received</h2>
                  <p style="font-size: 18px; color: #666; margin: 5px 0 0 0;">Order #${numericOrderId} (DB ID: ${order_id})</p>
                </div>
                
                <div style="background-color: #f9f9f9; border-radius: 4px; padding: 15px; margin-bottom: 25px;">
                  <h3 style="color: #444; margin-top: 0;">Customer Information</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px; width: 120px; color: #666;"><strong>Name:</strong></td>
                      <td style="padding: 8px;">${first_name} ${last_name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; color: #666;"><strong>Email:</strong></td>
                      <td style="padding: 8px;"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; color: #666;"><strong>Phone:</strong></td>
                      <td style="padding: 8px;">${phone}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="background-color: #f9f9f9; border-radius: 4px; padding: 15px; margin-bottom: 25px;">
                  <h3 style="color: #444; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h3>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <thead>
                      <tr style="background-color: #f0f0f0;">
                        <th style="padding: 10px; text-align: left;">Item</th>
                        <th style="padding: 10px; text-align: right;">Unit Price</th>
                        <th style="padding: 10px; text-align: right;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsSummary}
                    </tbody>
                  </table>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                      <td style="padding: 5px; text-align: right;">Subtotal:</td>
                      <td style="padding: 5px; text-align: right; width: 100px;">€${total.toFixed(2)}</td>
                    </tr>
                    ${discount > 0 ? `
                    <tr>
                      <td style="padding: 5px; text-align: right;">Discount (${discount}%):</td>
                      <td style="padding: 5px; text-align: right; color: #c00;">-€${discountAmount.toFixed(2)}</td>
                    </tr>` : ''}
                    <tr>
                      <td style="padding: 5px; text-align: right;">Shipping:</td>
                      <td style="padding: 5px; text-align: right;">€${deliveryValue}</td>
                    </tr>
                    <tr style="font-weight: bold; font-size: 16px;">
                      <td style="padding: 10px 5px; text-align: right; border-top: 2px solid #eee;">Total:</td>
                      <td style="padding: 10px 5px; text-align: right; border-top: 2px solid #eee;">€${final_price.toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 10px;">Shipping Address</h3>
                  <p style="color: #555; margin-left: 15px;">
                    ${address}<br>
                    ${postal_code} ${city}<br>
                    ${state}, ${country}
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0 20px;">
                  <a href="http://localhost:5173/admin/orders/${order_id}" style="background-color: #0066cc; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Manage This Order</a>
                </div>
              </div>`
            );

            res.status(201).json({
              message: "Ordine creato con successo",
              order_id: numericOrderId, // Return numeric ID to client
              tracking_email: email,
            });
          } catch (error) {
            console.error("Errore invio email:", error);
            // L'ordine è stato creato ma l'invio email è fallito
            res.status(201).json({
              message: "Ordine creato ma invio email fallito",
              order_id: numericOrderId, // Return numeric ID to client
              tracking_email: email,
            });
          }
        });
      }
    );
  }
}

// Get order by ID
function getOrderById(req, res) {
  let { id } = req.params;

  // Check if it's a numeric customer-facing ID (larger than typical DB IDs)
  if (id > 1000000) {
    id = extractDatabaseId(parseInt(id));
  }

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
    if (results.length === 0)
      return res.status(404).json({ error: "Order not found" });

    // Add the customer-facing numeric ID to the response for consistency
    const response = results[0];
    response.numeric_id = generateNumericId(response.id);

    res.json(response);
  });
}

// Track order - update to work with numeric IDs
function trackOrder(req, res) {
  let { email, order_id } = req.body;

  if (!email || !order_id) {
    return res
      .status(400)
      .json({ error: "Email and order ID are required for tracking" });
  }

  // Check if it's a numeric customer-facing ID (larger than typical DB IDs)
  // A simple check if the ID is large enough to be a customer-facing ID
  if (order_id > 1000000) {
    order_id = extractDatabaseId(order_id);
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
    if (results.length === 0)
      return res
        .status(404)
        .json({ error: "Order not found or email does not match" });

    // Encode the ID in the response for consistency
    const response = results[0];
    response.encoded_id = generateNumericId(response.id);

    res.json(response);
  });
}

// Update order status
function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ["Pending", "Processing", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error:
        "Invalid status. Must be one of: Pending, Processing, Completed, Cancelled",
    });
  }

  const sql = `
        UPDATE Orders
        SET status = ?
        WHERE id = ?
    `;

  connection.query(sql, [status, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ error: "Order not found" });

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
  getOrdersByEmail,
};
