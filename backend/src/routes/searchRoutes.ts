import { Router } from "express";
import { searchResources, getHistory, deleteHistoryItem } from "../controllers/searchController";
import { requireAuth } from "../middleware/authMiddleware";
import { geminiSearchRateLimiter } from "../middleware/rateLimiters";

const router = Router();

// Protect all routes with requireAuth
router.post("/", requireAuth, geminiSearchRateLimiter, searchResources);
router.get("/history", requireAuth, getHistory);
router.delete("/history/:id", requireAuth, deleteHistoryItem);

export default router;
