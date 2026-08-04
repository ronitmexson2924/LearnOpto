import { Router } from "express";
import {
  saveResource,
  deleteSavedResource,
  getSavedResources,
  logInteraction,
} from "../controllers/resourceController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/save", requireAuth, saveResource);
router.delete("/save/:id", requireAuth, deleteSavedResource);
router.get("/saved", requireAuth, getSavedResources);
router.post("/interaction", requireAuth, logInteraction);

export default router;
