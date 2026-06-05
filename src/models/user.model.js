import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'New User' },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      default: null
    },
    password: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    otp: { type: String },
    otpExpires: { type: Date },
    role: { type: String, default: 'user', enum: ['user', 'vendor', 'admin'] },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index to handle sparse unique constraint on email
userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $exists: true, $ne: null } }
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);
export default User;
