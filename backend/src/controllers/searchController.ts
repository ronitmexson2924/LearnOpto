import { Response } from "express";
import dns from "dns/promises";
import net from "net";
import prisma from "../lib/prisma";
import { geminiKeyManager } from "../lib/geminiKeyManager";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { searchQuotaConfig } from "../config/security";
import { schemas, sendValidationError, validateBody } from "../utils/requestValidation";

type SearchRequest = {
  topic: string;
};

type GeneratedResource = {
  title: string;
  description: string | null;
  url: string;
  type: string;
};

const urlValidationConfig = {
  timeoutMs: 3500,
  maxRedirects: 3,
};

const startOfUtcDay = (date: Date): Date => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const nextUtcDay = (date: Date): Date => {
  const next = startOfUtcDay(date);
  next.setUTCDate(next.getUTCDate() + 1);
  return next;
};

const consumeDailySearchQuota = async (
  userId: string
): Promise<
  | { allowed: true }
  | { allowed: false; reason: "missing-user" }
  | { allowed: false; reason: "quota"; used: number; quota: number; resetAt: Date }
> => {
  const now = new Date();
  const today = startOfUtcDay(now);

  await prisma.user.updateMany({
    where: {
      id: userId,
      OR: [{ dailySearchDate: null }, { dailySearchDate: { lt: today } }],
    },
    data: {
      dailySearchCount: 0,
      dailySearchDate: today,
    },
  });

  const quotaUpdate = await prisma.user.updateMany({
    where: {
      id: userId,
      dailySearchCount: { lt: searchQuotaConfig.dailyQuota },
    },
    data: {
      dailySearchCount: { increment: 1 },
      dailySearchDate: today,
      totalGeminiRequests: { increment: 1 },
      searchCount: { increment: 1 },
    },
  });

  if (quotaUpdate.count > 0) {
    return { allowed: true };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { dailySearchCount: true },
  });

  if (!user) {
    return { allowed: false, reason: "missing-user" };
  }

  return {
    allowed: false,
    reason: "quota",
    used: user.dailySearchCount,
    quota: searchQuotaConfig.dailyQuota,
    resetAt: nextUtcDay(now),
  };
};

const normalizeGeneratedResource = (resource: unknown): GeneratedResource | null => {
  if (!resource || typeof resource !== "object") return null;

  const item = resource as Record<string, unknown>;
  if (typeof item.url !== "string" || !item.url.trim()) return null;

  return {
    title: typeof item.title === "string" && item.title.trim() ? item.title.trim().slice(0, 300) : "Untitled Resource",
    description:
      typeof item.description === "string" && item.description.trim()
        ? item.description.trim().slice(0, 2000)
        : null,
    url: item.url.trim().slice(0, 2048),
    type: typeof item.type === "string" && item.type.trim() ? item.type.trim().slice(0, 40) : "article",
  };
};

const parseIpv4Parts = (address: string): number[] | null => {
  const parts = address.split(".");
  if (parts.length !== 4) return null;

  const parsed = parts.map((part) => Number.parseInt(part, 10));
  if (parsed.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return null;
  }

  return parsed;
};

const isBlockedIpv4Address = (address: string): boolean => {
  const parts = parseIpv4Parts(address);
  if (!parts) return true;

  const [first, second, third] = parts;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 0 && (third === 0 || third === 2)) ||
    (first === 192 && second === 168) ||
    (first === 198 && (second === 18 || second === 19)) ||
    (first === 198 && second === 51 && third === 100) ||
    (first === 203 && second === 0 && third === 113) ||
    first >= 224
  );
};

const isBlockedIpv6Address = (address: string): boolean => {
  const normalized = address.toLowerCase();

  if (normalized === "::" || normalized === "::1") return true;
  if (normalized.startsWith("::ffff:")) return true;
  if (normalized.startsWith("64:ff9b:")) return true;
  if (normalized.startsWith("2001:db8:") || normalized === "2001:db8::") return true;
  if (normalized.startsWith("2002:")) return true;

  const firstHextet = Number.parseInt(normalized.split(":")[0] || "0", 16);
  if (!Number.isFinite(firstHextet)) return true;

  const isUniqueLocal = (firstHextet & 0xfe00) === 0xfc00;
  const isLinkLocal = (firstHextet & 0xffc0) === 0xfe80;
  const isMulticast = (firstHextet & 0xff00) === 0xff00;

  return isUniqueLocal || isLinkLocal || isMulticast;
};

const isBlockedNetworkAddress = (address: string): boolean => {
  const ipVersion = net.isIP(address);
  if (ipVersion === 4) return isBlockedIpv4Address(address);
  if (ipVersion === 6) return isBlockedIpv6Address(address);
  return true;
};

const isBlockedHostname = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");
  return normalized === "localhost" || normalized.endsWith(".localhost");
};

const getHostnameForNetworkCheck = (hostname: string): string => {
  return hostname.replace(/^\[(.*)\]$/, "$1");
};

const isPublicHttpUrl = async (url: URL): Promise<boolean> => {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (url.username || url.password) return false;
  const hostname = getHostnameForNetworkCheck(url.hostname);
  if (isBlockedHostname(hostname)) return false;

  const literalIpVersion = net.isIP(hostname);
  if (literalIpVersion) {
    return !isBlockedNetworkAddress(hostname);
  }

  try {
    const addresses = await dns.lookup(hostname, { all: true, verbatim: false });
    return addresses.length > 0 && addresses.every(({ address }) => !isBlockedNetworkAddress(address));
  } catch {
    return false;
  }
};

const fetchUrlHeaders = async (
  url: URL,
  method: "HEAD" | "GET"
): Promise<globalThis.Response | null> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), urlValidationConfig.timeoutMs);

  try {
    return await fetch(url.toString(), {
      method,
      signal: controller.signal,
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Helper to validate URL existence via HEAD/GET request with timeout
const isUrlResolvable = async (urlStr: string): Promise<boolean> => {
  try {
    let currentUrl = new URL(urlStr);

    for (let redirectCount = 0; redirectCount <= urlValidationConfig.maxRedirects; redirectCount++) {
      if (!(await isPublicHttpUrl(currentUrl))) return false;

      let response = await fetchUrlHeaders(currentUrl, "HEAD");
      if (!response || response.status === 405) {
        response = await fetchUrlHeaders(currentUrl, "GET");
      }
      if (!response) return false;

      const status = response.status;
      const redirectLocation = response.headers.get("location");
      await response.body?.cancel().catch(() => undefined);

      if (status >= 300 && status < 400) {
        if (!redirectLocation) return false;
        currentUrl = new URL(redirectLocation, currentUrl);
        continue;
      }

      return status >= 200 && status < 400;
    }

    return false;
  } catch {
    return false;
  }
};

export const searchResources = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validation = validateBody<SearchRequest>(req.body, schemas.search);
    if (!validation.ok) {
      sendValidationError(res, validation.errors);
      return;
    }

    const { topic } = validation.value;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const quota = await consumeDailySearchQuota(userId);
    if (!quota.allowed) {
      if (quota.reason === "missing-user") {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      res.status(429).json({
        error: "Daily search quota reached",
        quota: quota.quota,
        used: quota.used,
        resetAt: quota.resetAt.toISOString(),
      });
      return;
    }

    // Fetch user format preferences if set
    let preferredFormatsHint = "";
    const userPref = await prisma.userPreference.findUnique({ where: { userId } });
    if (userPref && Array.isArray(userPref.preferredSources) && (userPref.preferredSources as string[]).length > 0) {
      preferredFormatsHint = `The user prefers learning resources in the following formats: ${(userPref.preferredSources as string[]).join(", ")}. Prioritize these preferred formats.`;
    }

    // Call Gemini API to generate resources (request 6 to 8 items to account for validation filtering)
    const prompt = `You are an expert learning resource curator. The user wants to learn about: "${topic}".
${preferredFormatsHint}
Generate 6 to 8 high-quality, highly relevant, real learning resources across different formats (a mix of YouTube videos, podcasts, articles, and documentation/courses).
Ensure all URLs provided are real, accurate, standard canonical URLs (e.g., https://youtube.com/watch?v=..., https://react.dev, https://docs.python.org, https://developer.mozilla.org, etc.).

Return the result strictly as a JSON array of objects with the following keys:
- title: String
- description: String
- url: String
- type: String (one of: 'video', 'course', 'article', 'documentation')

Do not include any markdown formatting or extra text, just the raw JSON array.`;

    const response = await geminiKeyManager.generateContent(prompt, "gemini-2.5-flash");

    let jsonText = response.text || "[]";
    jsonText = jsonText.replace(/^```json/g, "").replace(/```$/g, "").trim();

    let rawResources: unknown[] = [];
    try {
      rawResources = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse Gemini response", jsonText);
      res.status(500).json({ error: "Failed to generate resources from AI" });
      return;
    }

    if (!Array.isArray(rawResources)) {
      rawResources = [];
    }

    const generatedResources = rawResources
      .map(normalizeGeneratedResource)
      .filter((resource): resource is GeneratedResource => resource !== null);

    // Option A: Validate each URL concurrently to filter out hallucinated/broken links
    const validationResults = await Promise.all(
      generatedResources.map(async (r) => {
        const valid = await isUrlResolvable(r.url);
        return valid ? r : null;
      })
    );

    // Keep valid resources, fallback to raw list if strict validation filtered out everything
    let validResources = validationResults.filter((r): r is GeneratedResource => r !== null);
    if (validResources.length === 0 && generatedResources.length > 0) {
      validResources = generatedResources.slice(0, 6);
    }

    // Map and store in Database
    const searchHistory = await prisma.searchHistory.create({
      data: {
        query: topic,
        userId: userId,
        resources: {
          create: validResources.map((r) => ({
            title: r.title || "Untitled Resource",
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

    // Increment analytics non-blockingly
    prisma.userAnalytics
      .upsert({
        where: { userId },
        update: {
          totalSearches: { increment: 1 },
          lastActivity: new Date(),
        },
        create: {
          userId,
          totalSearches: 1,
          lastActivity: new Date(),
        },
      })
      .catch((err) => console.error("Analytics update error:", err));

    res.status(200).json({ resources: searchHistory.resources });
  } catch (error) {
    console.error("Error in searchResources:", error);
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

    const deleted = await prisma.searchHistory.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      res.status(404).json({ error: "Search history not found or unauthorized" });
      return;
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
