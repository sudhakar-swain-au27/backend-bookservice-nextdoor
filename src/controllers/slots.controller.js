import Availability from '../models/availability.model.js';
import Booking from '../models/Booking.js';
import { Service } from '../models/service.model.js';
import generateSlotsForDate from '../utils/slotGenerator.js';

export const getSlots = async (req, res, next) => {
  try {
    const { businessId, serviceId, date, professionalId } = req.query;
    if (!businessId || !serviceId || !date) {
      return res.status(400).json({ message: 'businessId, serviceId and date are required (YYYY-MM-DD)' });
    }

    // Find availability config
    const availabilityQuery = { business: businessId, service: serviceId };
    if (professionalId) availabilityQuery.professional = professionalId;
    else availabilityQuery.professional = { $exists: false };
    let availability = await Availability.findOne(availabilityQuery);

    // If no availability doc, build a default from business/service
    let slotDuration = 30;
    if (!availability) {
      const svc = await Service.findById(serviceId).lean();
      if (svc && svc.duration) slotDuration = svc.duration;

      // Default open 09:00-17:00 Monday-Sunday
      availability = {
        workingHours: [
          { day: 0, open: '09:00', close: '17:00', breaks: [] },
          { day: 1, open: '09:00', close: '17:00', breaks: [] },
          { day: 2, open: '09:00', close: '17:00', breaks: [] },
          { day: 3, open: '09:00', close: '17:00', breaks: [] },
          { day: 4, open: '09:00', close: '17:00', breaks: [] },
          { day: 5, open: '09:00', close: '17:00', breaks: [] },
          { day: 6, open: '09:00', close: '17:00', breaks: [] },
        ],
        slotDuration,
        timezone: 'UTC',
        blockedDates: [],
        maxConcurrentBookings: 1,
      };
    }

    // Fetch bookings for the date range
    const dayStart = new Date(date + 'T00:00:00.000Z');
    const dayEnd = new Date(date + 'T23:59:59.999Z');

    const bookings = await Booking.find({
      businessId,
      serviceId,
      'slot.start': { $gte: dayStart, $lte: dayEnd },
    }).lean();

    const slots = generateSlotsForDate(availability, date, bookings, availability.maxConcurrentBookings || 1);

    return res.json({ date, slots });
  } catch (err) {
    next(err);
  }
};

export default { getSlots };
