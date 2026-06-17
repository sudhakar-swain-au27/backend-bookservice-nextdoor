import express from 'express';
import { getSlots } from '../controllers/slots.controller.js';

const router = express.Router();

// GET /api/v1/slots?businessId=&serviceId=&date=YYYY-MM-DD
router.get('/', getSlots);

export default router;
