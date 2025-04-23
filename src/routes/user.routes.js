const express = require('express');
const passport = require('passport');
const { sendOtp, verifyOtp } = require('../controllers/auth.controller');

const router = express.Router();

// Google Auth Initiation
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Auth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.json({ message: 'Google login successful', user: req.user });
  }
);

// OTP Login Routes
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);

module.exports = router;
