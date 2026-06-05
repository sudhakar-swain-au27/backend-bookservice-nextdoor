// src/controllers/auth.controller.js
import admin from "../config/firebase.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/user.model.js";
import { sendOtpSms } from "../services/otp.service.js";

const makeUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  isProfileComplete: user.isProfileComplete,
});

export const firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ success: false, message: "No ID token provided" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Invalid token or missing phone number" });
    }

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({ phoneNumber, name: "New User" });
    }

    const token = generateToken(user._id, "user", { phoneNumber });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: makeUserPayload(user),
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { phoneNumber, otp, otpExpires, name: "New User" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      await sendOtpSms(phoneNumber, otp);
    } else {
      console.warn(`OTP for ${phoneNumber}: ${otp}`);
    }

    return res.status(200).json({ success: true, message: "OTP sent successfully", phoneNumber: user.phoneNumber });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id, "user", { phoneNumber });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: makeUserPayload(user),
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};
