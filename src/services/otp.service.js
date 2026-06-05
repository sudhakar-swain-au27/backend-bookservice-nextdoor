import twilio from "twilio";
import User from "../models/user.model.js";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOtpSms = async (phoneNumber, otp) => {
    if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        throw new Error("Twilio is not configured properly.");
    }

    await client.messages.create({
        body: `Your OTP is: ${otp}`,
        to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
  });

    await User.updateOne({ phoneNumber }, { otp, otpExpires: Date.now() + 300000 });
};
