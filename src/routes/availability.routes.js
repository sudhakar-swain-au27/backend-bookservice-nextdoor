import express from 'express';
import { createOrUpdateAvailability, getAvailability } from '../controllers/availability.controller.js';
import { protectBusiness } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Business can set/update availability
router.post('/', protectBusiness, createOrUpdateAvailability);

// Get availability (public)
router.get('/', getAvailability);

export default router;
