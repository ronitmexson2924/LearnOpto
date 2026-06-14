import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const searchResources = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { topic } = req.body;
    const userId = req.userId;

    if (!topic || !userId) {
      res.status(400).json({ error: "Topic and Authentication are required" });
      return;
    }

    // Call Gemini API to generate resources
    const prompt = `You are a learning resource curator. The user wants to learn about: "${topic}".
Generate exactly 4 high-quality learning resources (a mix of videos, articles, and courses).
Return the result strictly as a JSON array of objects with the following keys:
- title: String
- description: String
- url: String
- type: String (one of: 'video', 'course', 'article', 'documentation')

Do not include any markdown formatting, just the raw JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let jsonText = response.text || "[]";
    jsonText = jsonText.replace(/^```json/g, "").replace(/```$/g, "").trim();

    let resources = [];
    try {
      resources = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse Gemini response", jsonText);
      res.status(500).json({ error: "Failed to generate resources from AI" });
      return;
    }

    // Map the new schema 'SearchHistory' and 'SearchResource'
    const searchHistory = await prisma.searchHistory.create({
      data: {
        query: topic,
        userId: userId,
        resources: {
          create: resources.map((r: any) => ({
            title: r.title || "Untitled",
            description: r.description || null,
            url: r.url || "#",
            type: r.type || "article",
            source: "gemini",
          })),
        },
      },
      include: {
        resources: true,
      },
    });

    res.status(200).json({ resources: searchHistory.resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Scope to the authenticated user strictly
    const history = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        resources: true,
      },
    });

    res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// New endpoints for ownership validation examples
export const deleteHistoryItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const id = req.params.id as string;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Vulnerability Fix: findFirst with id AND userId guarantees ownership
    const searchHistory = await prisma.searchHistory.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!searchHistory) {
      res.status(404).json({ error: "Search history not found or unauthorized" });
      return;
    }

    await prisma.searchHistory.delete({
      where: { id },
    });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
