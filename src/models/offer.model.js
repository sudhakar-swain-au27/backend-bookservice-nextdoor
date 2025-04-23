import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Offer title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountPercent: {
      type: Number,
      required: [true, "Discount percentage is required"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Offer expiry date is required"],
    },
  },
  { timestamps: true }
);

export const Offer = mongoose.model("Offer", offerSchema);
