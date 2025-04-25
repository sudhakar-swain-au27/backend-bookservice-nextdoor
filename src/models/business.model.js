import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const businessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    ownerName: { type: String, default: "", trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, default: "", trim: true },
    password: { type: String, required: true },

    category: { type: String, default: "", trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    mapLocation: { type: String },
    description: { type: String, trim: true },

    // Working Hours
    openingTime: { type: String },
    closingTime: { type: String },
    closedDays: { type: String },

    // Media
    logo: { type: String },
    banner: { type: String },
    gallery: [{ type: String }],

    // Dynamic Sections
    services: [
      {
        serviceName: { type: String, required: true },
        description: String,
        price: Number,
        duration: String,
        category: String,
        image: String,
        slots: [String],
      }
    ],

    offers: [{ type: String }],

    professionals: [
      {
        name: { type: String, required: true },
        speciality: String,
        photo: String,
      }
    ],

    // Status Flags
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Password Hashing
businessSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

businessSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
// Auto-generate slug from businessName before saving
businessSchema.pre("save", function (next) {
  if (!this.slug && this.businessName) {
    this.slug = slugify(this.businessName, { lower: true, strict: true });
  }
  next();
});


const Business = mongoose.model("Business", businessSchema);
export default Business;
