const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, text, html) {
  console.log("Attempting to send email with credentials:", {
    from: process.env.EMAIL_USER,
    to: to,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, "<br>"),
  };

  try {
    // Verifica la connessione
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    throw error;
  }
}

module.exports = sendEmail;
