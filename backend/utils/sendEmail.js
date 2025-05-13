const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
    }
});

async function sendOrderUpdateEmail(to, subject, text) {
    await transporter.sendMail({
        from: '"Boolean Shop" <your@email.com>',
        to,
        subject,
        text
    });
}

module.exports = sendOrderUpdateEmail;