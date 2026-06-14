import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Unauthorized: Missing authentication token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey") as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    return;
  }
};
