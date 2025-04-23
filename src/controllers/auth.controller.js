// src/controllers/auth.controller.js
import admin from "../config/firebase.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

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

    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful",
      token: appToken,
      user: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
