import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const businessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    ownerName: { type: String, default: "", trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows multiple empty values
      default: "",
      trim: true,
    },
    password: { type: String, required: true },

    category: { type: String, default: "", trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    mapLocation: { type: String },
    description: { type: String, trim: true },

    logo: { type: String },
    banner: { type: String },
    gallery: [{ type: String }],

    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
businessSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare entered password with hashed
businessSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Business = mongoose.model("Business", businessSchema);
export default Business;
