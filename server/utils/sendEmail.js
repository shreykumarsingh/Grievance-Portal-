const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: '"Grievance Portal" <grievanceportalbmsce@gmail.com>',
      to,
      subject,
      html,
      text,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (err) {
    console.error('Failed to send email (continuing operation):', err.message);
    return null;
  }
};

module.exports = sendEmail;
