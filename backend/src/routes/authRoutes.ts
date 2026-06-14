import { Router } from "express";
import { register, login, logout, googleLoginRedirect, googleCallback, me } from "../controllers/authController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", requireAuth, me);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/google/login", googleLoginRedirect);
router.get("/google/callback", googleCallback);

export default router;
