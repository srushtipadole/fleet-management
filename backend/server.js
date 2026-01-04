import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { attachSocketHandlers } from "./utils/socket.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import telemetryRoutes from "./routes/telemetryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from './routes/userRoutes.js'
import vehicleRoutes from './routes/vehicleRoutes.js'
import tripsRoutes from "./routes/tripsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import blockchainRoutes from "./routes/blockchainRoutes.js";

dotenv.config();
const app = express();
connectDB();

app.set("trust proxy", 1);

// Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:19000"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Base
app.get("/", (req, res) => res.send("Fleet Backend Running"));

// Server + Socket
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// 🔐 Secure socket handlers
attachSocketHandlers(io);

// Share io
app.set("io", io);

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
