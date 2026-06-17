import twilio from 'twilio';
import { sendToUser } from '../utils/mailer.js';

const twilioClient = process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN ? twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN) : null;

export const sendBookingConfirmation = async ({ toEmail, toName, toPhone, booking }) => {
  // Send email (fire-and-forget)
  try {
    if (toEmail) {
      await sendToUser({ name: toName || 'Customer', email: toEmail });
    }
  } catch (err) {
    console.error('Failed sending booking email:', err?.message || err);
  }

  // Send SMS
  try {
    if (toPhone && twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      await twilioClient.messages.create({
        body: `Booking confirmed: ${booking.bookingId} on ${new Date(booking.slot.start).toLocaleString()}`,
        to: toPhone,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    }
  } catch (err) {
    console.error('Failed sending booking SMS:', err?.message || err);
  }
};

export const sendReminder = async ({ toPhone, toEmail, toName, booking }) => {
  try {
    if (toEmail) {
      await sendToUser({ name: toName || 'Customer', email: toEmail });
    }
  } catch (err) {
    console.error('Failed sending reminder email:', err?.message || err);
  }

  try {
    if (toPhone && twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      await twilioClient.messages.create({
        body: `Reminder: you have a booking (${booking.bookingId}) on ${new Date(booking.slot.start).toLocaleString()}`,
        to: toPhone,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    }
  } catch (err) {
    console.error('Failed sending reminder SMS:', err?.message || err);
  }
};

export default { sendBookingConfirmation, sendReminder };
