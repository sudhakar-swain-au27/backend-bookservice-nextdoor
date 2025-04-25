import express from "express";
import {
  registerBusiness,
  loginBusiness,
  completeBusinessProfile,
  getBusinessProfile,
  updateBusinessProfile,
  addService,
  getMyServices,
  deleteService,
  updateService,
  createOffer,
  getOffers,
  deleteOffer,
} from "../controllers/business.controller.js";

import  {protectBusiness}  from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public Routes (no auth)
router.post("/register", registerBusiness);
router.post("/login", loginBusiness);

// Protected Routes (after login, JWT token required)
router.post("/complete-profile", protectBusiness, completeBusinessProfile);
router.get("/profile", protectBusiness, getBusinessProfile);
router.put("/update-profile", protectBusiness, updateBusinessProfile);

// Services Management
router.post("/services", protectBusiness, addService);
router.get("/services", protectBusiness, getMyServices);
router.put("/services/:serviceId", protectBusiness, updateService);
router.delete("/services/:serviceId", protectBusiness, deleteService);

// Offers Management
router.post("/offers", protectBusiness, createOffer);
router.get("/offers", protectBusiness, getOffers);
router.delete("/offers/:offerId", protectBusiness, deleteOffer);

export default router;
