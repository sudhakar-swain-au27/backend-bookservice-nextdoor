import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

// Routes
import businessRoutes from "./routes/business.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import bookingRoutes from "./routes/booking.routes.js"
import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from './routes/service.routes.js';
import publicRoutes from "./routes/public.routes.js";




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

// ✅ Rate Limiter: 200 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

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
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/public", publicRoutes);

// (Optional) Global Error Handler
// app.use(globalErrorHandler);

export default app;
