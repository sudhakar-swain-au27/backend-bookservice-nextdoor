import express from "express";
import passport from "passport";
import {
  getUserProfile,
  updateUserProfile,
  getUserBookings,
  deleteUserAccount
} from "../controllers/user.controller.js";
import { protectUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Google Auth Initiation (Public)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Google Auth Callback (Public)
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    res.json({ message: "Google login successful", user: req.user });
  }
);

// User Profile Routes (Protected)
router.get("/profile", protectUser, getUserProfile);
router.put("/profile", protectUser, updateUserProfile);
router.get("/bookings", protectUser, getUserBookings);
router.delete("/account", protectUser, deleteUserAccount);

export default router;
