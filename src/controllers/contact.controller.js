import { sendToAdmin, sendToUser } from '../utils/mailer.js';

export const handleContactSubmission = async (req, res) => {
  const { name, email, phone, business, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    await sendToAdmin({ name, email, phone, business, message });
    await sendToUser({ name, email });

    res.status(200).json({ success: true, message: 'Emails sent successfully.' });
  } catch (err) {
    console.error('Email send failed:', err);
    res.status(500).json({ error: 'Email send failed.' });
  }
};
