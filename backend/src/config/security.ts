import { CookieOptions } from "express";

const parsePositiveInt = (name: string, fallback: number): number => {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseBoolean = (name: string, fallback: boolean): boolean => {
  const raw = process.env[name];
  if (!raw) return fallback;

  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
};

const parseSizeLimit = (name: string, fallback: string): string => {
  const raw = process.env[name];
  if (!raw) return fallback;

  const normalized = raw.trim().toLowerCase();
  return /^\d+(b|kb|mb)?$/.test(normalized) ? normalized : fallback;
};

const parseSameSite = (value?: string): CookieOptions["sameSite"] => {
  if (!value) return process.env.NODE_ENV === "production" ? "none" : "lax";

  const normalized = value.toLowerCase();
  if (normalized === "strict" || normalized === "lax" || normalized === "none") {
    return normalized as CookieOptions["sameSite"];
  }

  return process.env.NODE_ENV === "production" ? "none" : "lax";
};

const parseUrl = (value: string, name: string): string => {
  try {
    const url = new URL(value);
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
      throw new Error(`${name} must use HTTPS in production`);
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(`${name} must use HTTP or HTTPS`);
    }
    return url.toString();
  } catch (error) {
    throw new Error(`Invalid ${name}: ${(error as Error).message}`);
  }
};

const parseOrigin = (value: string, name: string): string => {
  try {
    const url = new URL(value);
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
      throw new Error(`${name} must use HTTPS in production`);
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(`${name} must use HTTP or HTTPS`);
    }
    return url.origin;
  } catch (error) {
    throw new Error(`Invalid ${name}: ${(error as Error).message}`);
  }
};

const parseOriginList = (raw: string): string[] => {
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
      const parsed = new URL(origin);
      return parsed.origin;
    });
};

const assertRpId = (rpID: string): string => {
  if (!rpID || rpID.includes("://") || rpID.includes("/") || rpID.includes(":")) {
    throw new Error("Invalid RP_ID: use a hostname such as localhost or example.com");
  }
  return rpID;
};

const frontendUrl = parseOrigin(process.env.FRONTEND_URL || "http://localhost:8080", "FRONTEND_URL");
const authCookieSameSite = parseSameSite(process.env.AUTH_COOKIE_SAME_SITE);
const authCookieSecure = parseBoolean("AUTH_COOKIE_SECURE", process.env.NODE_ENV === "production");

const rawAllowedOrigins = process.env.ALLOWED_ORIGINS
  ? parseOriginList(process.env.ALLOWED_ORIGINS)
  : [];

const allowedOrigins = Array.from(
  new Set([
    frontendUrl,
    ...rawAllowedOrigins,
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
  ])
);

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  bcryptWorkFactor: parsePositiveInt("BCRYPT_WORK_FACTOR", 10),
  failedLoginFailureMessage: "Invalid credentials",
  cookieOptions: {
    httpOnly: true,
    secure: authCookieSecure,
    sameSite: authCookieSameSite,
    domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
  } satisfies CookieOptions,
  cookieMaxAgeMs: parsePositiveInt("AUTH_COOKIE_MAX_AGE_MS", 7 * 24 * 60 * 60 * 1000),
  oauthStateTtlMs: parsePositiveInt("OAUTH_STATE_TTL_MS", 5 * 60 * 1000),
};

export const appConfig = {
  frontendUrl,
  allowedOrigins,
  jsonBodyLimit: parseSizeLimit("JSON_BODY_LIMIT", "32kb"),
  googleRedirectUri: parseUrl(
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback",
    "GOOGLE_REDIRECT_URI"
  ),
  githubRedirectUri: parseUrl(
    process.env.GITHUB_REDIRECT_URI || "http://localhost:3000/api/auth/github/callback",
    "GITHUB_REDIRECT_URI"
  ),
};

export const rateLimitConfig = {
  globalWindowMs: parsePositiveInt("GLOBAL_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  globalMax: parsePositiveInt("GLOBAL_RATE_LIMIT_MAX", 100),
  loginWindowMs: parsePositiveInt("LOGIN_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  loginMax: parsePositiveInt("LOGIN_RATE_LIMIT_MAX", 10),
  registrationWindowMs: parsePositiveInt("REGISTRATION_RATE_LIMIT_WINDOW_MS", 60 * 60 * 1000),
  registrationMax: parsePositiveInt("REGISTRATION_RATE_LIMIT_MAX", 5),
  passkeyAuthWindowMs: parsePositiveInt("PASSKEY_AUTH_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  passkeyAuthMax: parsePositiveInt("PASSKEY_AUTH_RATE_LIMIT_MAX", 20),
  geminiSearchWindowMs: parsePositiveInt("GEMINI_SEARCH_RATE_LIMIT_WINDOW_MS", 60 * 1000),
  geminiSearchMax: parsePositiveInt("GEMINI_SEARCH_RATE_LIMIT_MAX", 7),
};

export const searchQuotaConfig = {
  dailyQuota: parsePositiveInt(
    "GEMINI_DAILY_SEARCH_QUOTA",
    parsePositiveInt("SEARCH_DAILY_QUOTA", 25)
  ),
};

const defaultExpectedOrigins = process.env.WEBAUTHN_EXPECTED_ORIGINS || process.env.ORIGIN || allowedOrigins.join(",");
const expectedOrigins = parseOriginList(defaultExpectedOrigins);

export const passkeyConfig = {
  rpName: process.env.RP_NAME || "LearnOpto Passkeys",
  rpID: assertRpId(process.env.RP_ID || new URL(frontendUrl).hostname),
  expectedOrigins,
  challengeTtlMs: parsePositiveInt("PASSKEY_CHALLENGE_TTL_MS", 5 * 60 * 1000),
};

