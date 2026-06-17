import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import passport from "passport";
import fs from "fs";
import path from "path";

// Routes
import businessRoutes from "./routes/business.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import serviceRoutes from './routes/service.routes.js';
import publicRoutes from "./routes/public.routes.js";
import slotsRoutes from './routes/slots.routes.js';
import availabilityRoutes from './routes/availability.routes.js';
import paymentRoutes from './routes/payment.routes.js';

import "./config/passport.config.js";




dotenv.config();

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS: Allow browser access during dev
app.use(cors({
  origin: "*", // or use your frontend URL later in production
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Helmet: Relax cross-origin policy for dev
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// ✅ Passport init for social login support
app.use(passport.initialize());

// ✅ Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads", "business");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Rate Limiter: 200 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ✅ Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Health Check Route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "Running 🚀" });
});
app.get("/", (req, res) => {
  res.send("🚀 BookService Backend is running");
});



// ✅ API Routes
app.use("/api/v1/business", businessRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/public", publicRoutes);
app.use("/api/v1/slots", slotsRoutes);
app.use('/api/v1/availability', availabilityRoutes);
app.use('/api/v1/payments', paymentRoutes);


// (Optional) Global Error Handler
// app.use(globalErrorHandler);

export default app;
