import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { rateLimitConfig } from "../config/security";
import { AuthenticatedRequest } from "./authMiddleware";

const jsonMessage = (error: string) => ({ error });

export const globalApiLimiter = rateLimit({
  windowMs: rateLimitConfig.globalWindowMs,
  limit: rateLimitConfig.globalMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonMessage("Too many requests, please try again later"),
});

export const loginRateLimiter = rateLimit({
  windowMs: rateLimitConfig.loginWindowMs,
  limit: rateLimitConfig.loginMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonMessage("Too many login attempts, please try again later"),
});

export const registrationRateLimiter = rateLimit({
  windowMs: rateLimitConfig.registrationWindowMs,
  limit: rateLimitConfig.registrationMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonMessage("Too many registration attempts, please try again later"),
});

export const passkeyAuthenticationRateLimiter = rateLimit({
  windowMs: rateLimitConfig.passkeyAuthWindowMs,
  limit: rateLimitConfig.passkeyAuthMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonMessage("Too many passkey authentication attempts, please try again later"),
});

export const geminiSearchRateLimiter = rateLimit({
  windowMs: rateLimitConfig.geminiSearchWindowMs,
  limit: rateLimitConfig.geminiSearchMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = (req as AuthenticatedRequest).userId;
    return userId ? `user:${userId}` : ipKeyGenerator(req.ip || "");
  },
  message: jsonMessage("Too many search requests, please try again later"),
});
