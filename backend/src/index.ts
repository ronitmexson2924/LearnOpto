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

// Number of reverse proxies in front of the app (Render = 1, Netlify /api proxy + Render = 2),
// so req.ip is the real client IP for rate limiting instead of the proxy's address.
app.set("trust proxy", appConfig.trustProxyHops);

// Security headers
app.use(helmet());

// Health check (outside /api so it isn't rate limited)
app.get("/health", (_req, res) => {
  res.status(200).send("ok");
});

// Rate Limiting
app.use("/api/", globalApiLimiter);

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean | string) => void) => {
    if (!origin) return callback(null, true);
    const cleaned = origin.replace(/\/+$/, "");
    if (appConfig.allowedOrigins.includes(cleaned)) {
      return callback(null, cleaned);
    }
    // Unknown origin: send no CORS headers so the browser blocks the response
    callback(null, false);
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

server.on('error', (err: Error) => {
  console.error("Server error:", err);
});


process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
