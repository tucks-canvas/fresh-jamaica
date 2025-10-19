const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
});

const emailService = {
  async sendVerificationCode(email, code) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'FreshJA - Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">FreshJA Password Reset</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  },

  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Welcome to FreshJA!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Welcome to FreshJA, ${name}!</h2>
          <p>Your account has been successfully created.</p>
          <p>Start exploring fresh produce from local farmers today!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  },
};

module.exports = emailService;