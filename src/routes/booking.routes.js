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

const router = express.Router();

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.get('/user/:userId', getBookingsByUser);
router.get('/business/:businessId', getBookingsByBusiness);
router.put('/:id', updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;
