import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUser,
  getBookingsByBusiness,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/booking.controller.js';
import { protectUser, protectBusiness } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public Routes (if needed)
router.get('/', getAllBookings);
router.get('/:id', getBookingById);

// Protected User Routes
router.post('/', protectUser, createBooking);
router.get('/user/:userId', protectUser, getBookingsByUser);

// Protected Business Routes
router.get('/business/:businessId', protectBusiness, getBookingsByBusiness);
router.put('/:id', protectBusiness, updateBookingStatus);
router.delete('/:id', protectBusiness, deleteBooking);

export default router;
