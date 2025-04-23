import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service', // You’ll create this later
      required: true,
    },
    category: {
      type: String,
      enum: ['salon', 'clinic', 'gym', 'yoga', 'restaurant', 'other'],
      required: true,
    },
    slot: {
      start: { type: Date, required: true },
      end: { type: Date },
    },
    guestCount: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    payment: {
      status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
      mode: { type: String, enum: ['cash', 'online'], default: 'cash' },
      txnId: { type: String },
      amount: { type: Number, required: true },
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    specialInstructions: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 Fast loading for dashboards
bookingSchema.index({ userId: 1, 'slot.start': -1 });
bookingSchema.index({ businessId: 1, 'slot.start': -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
