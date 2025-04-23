import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT), // Ensure it's a number
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ✅ Send mail to ADMIN
export const sendToAdmin = async ({ name, email, phone, business, message }) => {
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `📩 New Contact from ${name}`,
    html: `
      <h3>New Inquiry Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Business:</strong> ${business}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Failed to send to Admin:", error?.response || error);
    throw error;
  }
};

// ✅ Send confirmation mail to USER
export const sendToUser = async ({ name, email }) => {
  const mailOptions = {
    from: `"BookService Team" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "✅ We received your message!",
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for contacting <strong>BookService NextDoor</strong>.</p>
      <p>Our team has received your message and will be in touch soon.</p>
      <br />
      <p>Warm regards,<br />BookService Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Failed to send to User:", error?.response || error);
    throw error;
  }
};
