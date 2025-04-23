import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'New User' }, // ✅ optional for OTP users
    email: { type: String, unique: true, sparse: true }, // ✅ optional + allows multiple nulls
    password: { type: String }, // only used if email login is added
    googleId: { type: String },
    facebookId: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date },
    role: { type: String, default: 'user', enum: ['user', 'vendor', 'admin'] },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
