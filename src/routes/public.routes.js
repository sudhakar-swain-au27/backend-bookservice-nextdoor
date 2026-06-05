import express from "express";
import {
    getPublicProviderProfile,
    getPublicBusinessProfile,
    searchBusinesses
} from "../controllers/public.controller.js";

const router = express.Router();

/**
 * @route   GET /api/v1/public/search
 * @desc    Search businesses by category, city, or keyword
 * @access  Public
 */
router.get('/search', searchBusinesses);

/**
 * @route   GET /api/v1/public/provider/:slug
 * @desc    Get business profile by slug
 * @access  Public
 */
router.get('/provider/:slug', getPublicProviderProfile);

/**
 * @route   GET /api/v1/public/business/:businessId
 * @desc    Get business profile by ID
 * @access  Public
 */
router.get('/business/:businessId', getPublicBusinessProfile);

export default router;
