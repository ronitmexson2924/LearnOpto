import "dotenv/config";

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is missing in .env. Startup aborted.");
}

if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
  throw new Error("FATAL: JWT_SECRET must be at least 32 characters in production.");
}

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import searchRoutes from "./routes/searchRoutes";
import passkeyRoutes from "./routes/passkeyRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import userRoutes from "./routes/userRoutes";
import { globalApiLimiter } from "./middleware/rateLimiters";
import { appConfig } from "./config/security";

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// Rate Limiting
app.use("/api/", globalApiLimiter);

const allowedOrigins = Array.from(new Set([
  appConfig.frontendUrl.replace(/\/+$/, ""),
  "http://localhost:8080",
  "http://127.0.0.1:8080",
]));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleaned = origin.replace(/\/+$/, "");
    if (allowedOrigins.includes(cleaned)) {
      return callback(null, cleaned);
    }
    callback(null, cleaned);
  },
  credentials: true,
}));

app.use(express.json({ limit: appConfig.jsonBodyLimit, strict: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/passkeys", passkeyRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/user", userRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error("Server error:", err);
});


process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
