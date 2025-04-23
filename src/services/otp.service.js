const twilio = require('twilio');
const User = require('../models/user.model');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOtp = async (phoneNumber) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await client.messages.create({
        body: `Your OTP is: ${otp}`,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
    });
    
    await User.updateOne({ phoneNumber }, { otp, otpExpires: Date.now() + 300000 });
};

exports.verifyOtp = async (phoneNumber, otp) => {
    const user = await User.findOne({ phoneNumber });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
        return false;
    }
    return true;
};
