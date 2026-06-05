import express from 'express';
import {
    addService,
    getAllServices,
    getServicesByBusiness,
    getServiceById,
    updateService,
    deleteService
} from '../controllers/service.controller.js';
import { protectBusiness } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/v1/services
 * @desc    Get all available services
 * @access  Public
 */
router.get('/', getAllServices);

/**
 * @route   GET /api/v1/services/:serviceId
 * @desc    Get single service by ID
 * @access  Public
 */
router.get('/:serviceId', getServiceById);

/**
 * @route   GET /api/v1/services/business/:businessId
 * @desc    Get all services for a specific business
 * @access  Public
 */
router.get('/business/:businessId', getServicesByBusiness);

/**
 * @route   POST /api/v1/services
 * @desc    Business adds a new service
 * @access  Private (Business)
 */
router.post('/', protectBusiness, addService);

/**
 * @route   PUT /api/v1/services/:serviceId
 * @desc    Update a service
 * @access  Private (Business)
 */
router.put('/:serviceId', protectBusiness, updateService);

/**
 * @route   DELETE /api/v1/services/:serviceId
 * @desc    Delete a service
 * @access  Private (Business)
 */
router.delete('/:serviceId', protectBusiness, deleteService);

export default router;
