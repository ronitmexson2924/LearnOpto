import { Router } from "express";
import {
  registerOptions,
  registerVerify,
  authenticateOptions,
  authenticateVerify,
  listPasskeys,
  removePasskey,
} from "../controllers/passkeyController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// Registration requires the user to be logged in
router.post("/register/options", requireAuth, registerOptions);
router.post("/register/verify", requireAuth, registerVerify);

// Authentication is for users logging in
router.post("/authenticate/options", authenticateOptions);
router.post("/authenticate/verify", authenticateVerify);

// Management
router.get("/list", requireAuth, listPasskeys);
router.delete("/:id", requireAuth, removePasskey);

export default router;
