import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { schemas, sendValidationError, validateBody } from "../utils/requestValidation";

type PreferencesRequest = {
  preferredSources: string[];
};

export const getPreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    let preferences = await prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      preferences = await prisma.userPreference.create({
        data: {
          userId,
          preferredSources: ["video", "podcast", "documentation", "course"],
        },
      });
    }

    res.status(200).json({ preferences });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validation = validateBody<PreferencesRequest>(req.body, schemas.preferences);
    if (!validation.ok) {
      sendValidationError(res, validation.errors);
      return;
    }

    const userId = req.userId;
    const { preferredSources } = validation.value;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: { preferredSources },
      create: {
        userId,
        preferredSources,
      },
    });

    res.status(200).json({ preferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    let analytics = await prisma.userAnalytics.findUnique({
      where: { userId },
    });

    if (!analytics) {
      analytics = await prisma.userAnalytics.create({
        data: {
          userId,
          totalSearches: 0,
          totalResourcesSaved: 0,
          totalResourcesViewed: 0,
          lastActivity: new Date(),
        },
      });
    }

    res.status(200).json({ analytics });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
