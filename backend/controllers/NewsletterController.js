const connection = require("../database/db");
const sendEmail = require("../utils/sendEmail");

// Add email to newsletter list
const submitEmail = async (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: "Valid email address is required" });
  }

  const sql = `
        INSERT INTO Email_Newsletter (email)
        VALUES (?)
    `;

  connection.query(sql, [email], async (err) => {
    if (err) {
      // Handle duplicate email
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Email già registrata" });
      }
      return res.status(500).json({ error: err.message });
    }

    try {
      console.log("Email inviata a:", email);
      await sendEmail(
        email,
        "Benvenuto nella Newsletter di Boolean Shop",
        `Gentile cliente,

✨ Grazie per esserti iscritto alla newsletter di Boolean Shop! ✨

Ecco cosa riceverai:
• Offerte esclusive
• Novità sui prodotti
• Sconti speciali
• Contenuti personalizzati

Cordiali saluti,
Il team di Boolean Shop
---
Se non desideri più ricevere le nostre email, puoi cancellarti in qualsiasi momento.
© ${new Date().getFullYear()} Boolean Shop. Tutti i diritti riservati.`
      );

      res.status(201).json({
        message: "Email registrata con successo!",
        success: true,
      });
    } catch (error) {
      console.error("Errore invio email:", error);
      res.status(201).json({
        message: "Email registrata ma invio conferma fallito",
        success: true,
      });
    }
  });
};

// Get all newsletter subscribers (admin use only)
function getAllSubscribers(req, res) {
  const sql = `
        SELECT * 
        FROM Email_Newsletter
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
        DELETE FROM Email_Newsletter
        WHERE email = ?
    `;

  connection.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Email not found in subscription list" });
    }

    res.json({ message: "Successfully unsubscribed" });
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
  unsubscribeEmail,
};
