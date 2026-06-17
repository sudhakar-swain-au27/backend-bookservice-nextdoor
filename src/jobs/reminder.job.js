import cron from 'node-cron';
import Booking from '../models/Booking.js';
import notificationService from '../services/notification.service.js';

// Run every hour and send reminders for bookings starting ~24 hours from now
export const startReminderJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const targetStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const windowStart = new Date(targetStart.getTime() - 30 * 60 * 1000); // 30 min window
      const windowEnd = new Date(targetStart.getTime() + 30 * 60 * 1000);

      const bookings = await Booking.find({
        'slot.start': { $gte: windowStart, $lte: windowEnd },
        status: { $in: ['pending', 'confirmed'] },
      }).populate('userId').lean();

      for (const b of bookings) {
        // Attempt to notify; swallow errors
        (async () => {
          try {
            await notificationService.sendReminder({
              toEmail: b.userId?.email || undefined,
              toPhone: b.userId?.phone || undefined,
              toName: b.userId?.name || undefined,
              booking: b,
            });
          } catch (e) {
            console.error('Reminder send failed for', b._id, e?.message || e);
          }
        })();
      }
    } catch (err) {
      console.error('Reminder job failed', err?.message || err);
    }
  });
};

export default { startReminderJob };
