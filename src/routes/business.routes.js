import express from "express";
import multer from "multer";
import path from "path";
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

import { registerBusinessValidator } from "../middlewares/validate.business.js";
import { protectBusiness } from "../middlewares/auth.middleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads", "business"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

// Public Routes (no auth)
router.post("/register", registerBusinessValidator, registerBusiness);
router.post("/login", loginBusiness);

// Protected Routes (after login, JWT token required)
router.post(
  "/complete-profile",
  protectBusiness,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  completeBusinessProfile
);
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
