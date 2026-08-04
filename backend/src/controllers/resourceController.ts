import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { schemas, sendValidationError, validateBody } from "../utils/requestValidation";

type SaveResourceRequest = {
  title: string;
  description?: string;
  url: string;
  source?: string;
  type?: string;
  thumbnail?: string;
};

type ResourceInteractionRequest = {
  url?: string;
  resourceUrl?: string;
};

/**
 * POST /api/resources/save
 * Create a SavedResource for req.userId.
 * Idempotent via upsert on composite unique key [userId, url].
 */
export const saveResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validation = validateBody<SaveResourceRequest>(req.body, schemas.savedResource);
    if (!validation.ok) {
      sendValidationError(res, validation.errors);
      return;
    }

    const userId = req.userId;
    const { title, description, url, source, type, thumbnail } = validation.value;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const savedResource = await prisma.savedResource.upsert({
      where: {
        userId_url: {
          userId,
          url,
        },
      },
      update: {
        title,
        description: description || null,
        source: source || "unknown",
        type: type || "article",
        thumbnail: thumbnail || null,
      },
      create: {
        userId,
        url,
        title,
        description: description || null,
        source: source || "unknown",
        type: type || "article",
        thumbnail: thumbnail || null,
      },
    });

    // Update analytics non-blockingly
    prisma.userAnalytics
      .upsert({
        where: { userId },
        update: { totalResourcesSaved: { increment: 1 }, lastActivity: new Date() },
        create: { userId, totalResourcesSaved: 1, lastActivity: new Date() },
      })
      .catch((err) => console.error("Analytics error:", err));

    res.status(200).json({ resource: savedResource });
  } catch (error) {
    console.error("Error saving resource:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /api/resources/save/:id
 * Delete a SavedResource, strictly checking ownership against req.userId.
 */
export const deleteSavedResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const id = req.params.id as string;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const deleted = await prisma.savedResource.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      res.status(404).json({ error: "Saved resource not found or unauthorized" });
      return;
    }

    // Decrement analytics non-blockingly
    prisma.userAnalytics
      .update({
        where: { userId },
        data: { totalResourcesSaved: { decrement: 1 } },
      })
      .catch(() => null);

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting saved resource:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/resources/saved
 * Return the current user's saved resources, most recent first.
 */
export const getSavedResources = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const savedResources = await prisma.savedResource.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ resources: savedResources });
  } catch (error) {
    console.error("Error fetching saved resources:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/resources/interaction
 * Log a ResourceInteraction (type: CLICK / background non-blocking).
 */
export const logInteraction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const validation = validateBody<ResourceInteractionRequest>(req.body, schemas.resourceInteraction);
  if (!validation.ok) {
    sendValidationError(res, validation.errors);
    return;
  }

  const userId = req.userId;
  const { url, resourceUrl } = validation.value;
  const targetUrl = url || resourceUrl;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!targetUrl) {
    res.status(400).json({ error: "Resource URL is required" });
    return;
  }

  // Fast response so user interaction is non-blocking
  res.status(200).json({ success: true });

  // Fire background db record creation and analytics update
  Promise.all([
    prisma.resourceInteraction.create({
      data: {
        userId,
        resourceUrl: targetUrl,
        clicked: true,
      },
    }),
    prisma.userAnalytics.upsert({
      where: { userId },
      update: { totalResourcesViewed: { increment: 1 }, lastActivity: new Date() },
      create: { userId, totalResourcesViewed: 1, lastActivity: new Date() },
    }),
  ]).catch((err) => {
    console.error("Background interaction log error:", err);
  });
};
