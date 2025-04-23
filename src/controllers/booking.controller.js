// controllers/booking.controller.js
import Booking from '../models/Booking.js';
import { generateBookingId } from '../utils/generateBookingId.js';

// ✅ 1. Create Booking
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      businessId,
      serviceId,
      category,
      slot,
      payment,
      location,
      specialInstructions,
    } = req.body;

    const newBooking = new Booking({
      bookingId: generateBookingId(),
      userId,
      businessId,
      serviceId,
      category,
      slot,
      payment,
      location,
      specialInstructions,
    });

    await newBooking.save();
    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
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

    booking.status = req.body.status || booking.status;
    if (req.body.payment) {
      booking.payment = {
        ...booking.payment,
        ...req.body.payment,
      };
    }

    await booking.save();
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
