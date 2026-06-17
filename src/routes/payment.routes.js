import express from 'express';
import { createOrder, paymentWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

// Create a payment order (mock)
router.post('/create-order', createOrder);

// Webhook endpoint (POST from payment gateway)
router.post('/webhook', express.json(), paymentWebhook);

export default router;
