import mongoose from 'mongoose';

const breakSchema = new mongoose.Schema(
  {
    start: { type: String }, // e.g. "13:00"
    end: { type: String }, // e.g. "14:00"
  },
  { _id: false }
);

const workingHourSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true }, // 0 = Sunday .. 6 = Saturday
    open: { type: String },
    close: { type: String },
    breaks: [breakSchema],
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timezone: { type: String, default: 'UTC' },
    // minutes
    slotDuration: { type: Number, required: true, default: 30 },
    // weekly working hours array
    workingHours: [workingHourSchema],
    // Additional ad-hoc breaks (date-specific) are in blockedDates or breaks
    blockedDates: [
      {
        date: { type: Date },
        reason: { type: String },
      },
    ],
    maxConcurrentBookings: { type: Number, default: 1 },
    notes: { type: String },
  },
  { timestamps: true }
);

availabilitySchema.index({ business: 1, service: 1 });

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;
