// src/routes/auth.routes.js
import express from "express";
import { firebaseLogin, sendOtp, verifyOtp } from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/firebase-login", firebaseLogin);
router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);

export default router;
