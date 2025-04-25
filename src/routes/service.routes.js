import express from 'express';
import { addService, getAllServices } from '../controllers/service.controller.js';
import { protectBusiness } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/services
 * @desc    Business adds a new service
 * @access  Private (Business)
 */
router.post('/', protectBusiness, addService);

/**
 * @route   GET /api/services
 * @desc    Get all available services for users
 * @access  Public
 */
router.get('/', getAllServices);

export default router;
