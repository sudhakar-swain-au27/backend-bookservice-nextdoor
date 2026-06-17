// controllers/booking.controller.js
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Availability from '../models/availability.model.js';
import { generateBookingId } from '../utils/generateBookingId.js';
import { Service } from '../models/service.model.js';
import notificationService from '../services/notification.service.js';

// ✅ 1. Create Booking
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  let usingTransaction = true;
  try {
    const userId = req.user ? req.user._id : req.body.userId;
    const {
      businessId,
      serviceId,
      category,
      slot,
      payment,
      location,
      specialInstructions,
      professionalId,
    } = req.body;

    if (!userId || !businessId || !serviceId || !slot || !slot.start) {
      return res.status(400).json({ success: false, message: 'Missing required fields: userId, businessId, serviceId, slot.start' });
    }

    // Determine slot end using service duration if not provided
    let slotStart = new Date(slot.start);
    if (Number.isNaN(slotStart.getTime())) return res.status(400).json({ success: false, message: 'Invalid slot.start' });

    let slotEnd = slot.end ? new Date(slot.end) : null;
    if (!slotEnd) {
      const svc = await Service.findById(serviceId).lean();
      const duration = (svc && svc.duration) || 30;
      slotEnd = new Date(slotStart.getTime() + duration * 60000);
    }

    try {
      await session.startTransaction();
    } catch (txErr) {
      // Transactions not supported (e.g., standalone Mongo). Fall back to optimistic path.
      usingTransaction = false;
    }

    // Build availability query
    const availabilityQuery = { business: businessId, service: serviceId };
    if (professionalId) availabilityQuery.professional = professionalId;
    else availabilityQuery.professional = { $exists: false };

    let availability;
    if (usingTransaction) {
      availability = await Availability.findOne(availabilityQuery).session(session).lean();
    } else {
      availability = await Availability.findOne(availabilityQuery).lean();
    }
    const maxConcurrent = (availability && availability.maxConcurrentBookings) ? availability.maxConcurrentBookings : 1;

    // Count overlapping bookings for the same business+service
    const overlapQuery = {
      businessId,
      serviceId,
      status: { $ne: 'cancelled' },
      $or: [
        { 'slot.start': { $lt: slotEnd }, 'slot.end': { $gt: slotStart } },
        { 'slot.start': { $lt: slotEnd }, 'slot.end': { $exists: false } },
      ],
    };

    let overlapping;
    if (usingTransaction) overlapping = await Booking.countDocuments(overlapQuery).session(session);
    else overlapping = await Booking.countDocuments(overlapQuery);

    if (overlapping >= maxConcurrent) {
      if (usingTransaction) {
        await session.abortTransaction();
        session.endSession();
      }
      return res.status(409).json({ success: false, message: 'Slot not available' });
    }

    const newBooking = new Booking({
      bookingId: generateBookingId(),
      userId,
      businessId,
      serviceId,
      category,
      slot: { start: slotStart, end: slotEnd },
      payment,
      location,
      specialInstructions,
    });

    if (usingTransaction) {
      await newBooking.save({ session });
      await session.commitTransaction();
      session.endSession();

      // Send confirmation asynchronously
      (async () => {
        try {
          await notificationService.sendBookingConfirmation({
            toEmail: req.user?.email || (req.body.email),
            toName: req.user?.name || (req.body.name),
            toPhone: req.body.phone || (req.user?.phone),
            booking: newBooking,
          });
        } catch (e) {
          console.error('Notification error:', e?.message || e);
        }
      })();

      return res.status(201).json({ success: true, booking: newBooking });
    }

    // Fallback (no transactions): optimistic save
    // Simple retry loop to reduce race chance under contention
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // re-check overlapping before final insert
        const currentOverlap = await Booking.countDocuments(overlapQuery);
        if (currentOverlap >= maxConcurrent) {
          return res.status(409).json({ success: false, message: 'Slot not available' });
        }
        await newBooking.save();

        // Send confirmation asynchronously (fallback path)
        (async () => {
          try {
            await notificationService.sendBookingConfirmation({
              toEmail: req.user?.email || (req.body.email),
              toName: req.user?.name || (req.body.name),
              toPhone: req.body.phone || (req.user?.phone),
              booking: newBooking,
            });
          } catch (e) {
            console.error('Notification error:', e?.message || e);
          }
        })();

        return res.status(201).json({ success: true, booking: newBooking, note: 'Saved without transaction (fallback)' });
      } catch (saveErr) {
        // on unique/duplicate or transient errors, retry
        if (attempt === maxRetries - 1) throw saveErr;
        // small delay
        await new Promise((r) => setTimeout(r, 100 * (attempt + 1)));
      }
    }
  } catch (err) {
    try {
      await session.abortTransaction();
      session.endSession();
    } catch (e) { }
    res.status(500).json({ success: false, message: 'Booking failed', error: err.message });
  }
};

// ✅ 2. Get All Bookings (Admin or General Use)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId businessId serviceId');
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 3. Get Booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId businessId serviceId');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 4. Get Bookings for a Specific User
export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ 'slot.start': -1 });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 5. Get Bookings for a Specific Vendor (Business)
export const getBookingsByBusiness = async (req, res) => {
  try {
    const bookings = await Booking.find({ businessId: req.params.businessId }).sort({ 'slot.start': -1 });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 6. Update Booking Status (e.g., confirm, cancel)
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    const oldStatus = booking.status;
    booking.status = req.body.status || booking.status;
    if (req.body.payment) {
      booking.payment = {
        ...booking.payment,
        ...req.body.payment,
      };
    }

    await booking.save();

    // Notify user if status changed to confirmed or cancelled
    if (oldStatus !== booking.status && (booking.status === 'confirmed' || booking.status === 'cancelled')) {
      (async () => {
        try {
          const populated = await Booking.findById(booking._id).populate('userId').lean();
          await notificationService.sendBookingConfirmation({
            toEmail: populated.userId?.email || undefined,
            toName: populated.userId?.name || undefined,
            toPhone: populated.userId?.phone || undefined,
            booking: populated,
          });
        } catch (e) {
          console.error('Notification send failed on status change', e?.message || e);
        }
      })();
    }
    res.status(200).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 7. Delete Booking (Optional, Soft Delete Can Be Added Later)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
