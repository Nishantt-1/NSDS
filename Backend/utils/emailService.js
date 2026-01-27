const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your preferred provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send an email notification
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} text - Email body (text or HTML)
 */
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `"Campus System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `<h3>Campus Resource & Event Management</h3><p>${text}</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email Delivery Error:', error);
  }
};

module.exports = { sendEmail };