import { Router } from "express";
import { getPreferences, updatePreferences, getAnalytics } from "../controllers/userController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/preferences", getPreferences);
router.post("/preferences", updatePreferences);
router.get("/analytics", getAnalytics);

export default router;
