import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
    },
    offer: {
      type: String,
      default: "", // For example: "10% OFF"
    },
    image: {
      type: String, // Store image URL or file name
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);
