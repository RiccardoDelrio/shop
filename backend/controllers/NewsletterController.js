const connection = require('../database/db');

// Add email to newsletter list
function submitEmail(req, res) {
    const { email } = req.body;

    // Validate email format
    if (!email || !validateEmail(email)) {
        return res.status(400).json({ error: 'Valid email address is required' });
    }

    const sql = `
        INSERT INTO email_newsletter (email)
        VALUES (?)
    `;

    connection.query(sql, [email], (err, results) => {
        if (err) {
            // Handle duplicate email
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'This email is already subscribed' });
            }
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: 'Email added successfully!',
            reviewId: results.insertId
        });
    });
}

// Get all newsletter subscribers (admin use only)
function getAllSubscribers(req, res) {
    const sql = `
        SELECT email, created_at
        FROM email_newsletter
        ORDER BY created_at DESC
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

// Delete email from newsletter list (unsubscribe)
function unsubscribeEmail(req, res) {
    const { email } = req.params;

    const sql = `
        DELETE FROM email_newsletter
        WHERE email = ?
    `;

    connection.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Email not found in subscription list' });
        }

        res.json({ message: 'Successfully unsubscribed' });
    });
}

// Utility function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = {
    submitEmail,
    getAllSubscribers,
    unsubscribeEmail
};