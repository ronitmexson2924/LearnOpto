import { Router } from "express";
import {
  register,
  login,
  logout,
  googleLoginRedirect,
  googleCallback,
  githubLoginRedirect,
  githubCallback,
  me,
} from "../controllers/authController";
import { requireAuth } from "../middleware/authMiddleware";
import { loginRateLimiter, registrationRateLimiter } from "../middleware/rateLimiters";

const router = Router();

router.get("/me", requireAuth, me);
router.post("/register", registrationRateLimiter, register);
router.post("/login", loginRateLimiter, login);
router.post("/logout", logout);
router.get("/google/login", googleLoginRedirect);
router.get("/google/callback", googleCallback);
router.get("/github/login", githubLoginRedirect);
router.get("/github/callback", githubCallback);

export default router;
