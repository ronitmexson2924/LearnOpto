import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import crypto from "crypto";
import { appConfig, authConfig } from "../config/security";
import { clearAuthCookie, setAuthCookie, signAuthToken } from "../utils/authSession";
import { schemas, sendValidationError, validateBody, validateEmptyBody } from "../utils/requestValidation";
import { TemporaryStore } from "../utils/temporaryStore";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const oauthStateStore = new TemporaryStore<{ provider: "google" | "github"; returnUrl?: string }>();

type RegisterRequest = {
  email: string;
  password: string;
};

type LoginRequest = RegisterRequest;

const createOAuthState = (provider: "google" | "github", returnUrl?: string): string => {
  const state = `${provider}.${crypto.randomBytes(32).toString("hex")}`;
  oauthStateStore.set(state, { provider, returnUrl }, authConfig.oauthStateTtlMs);
  return state;
};

const setOAuthStateCookie = (res: Response, state: string): void => {
  res.cookie("oauth_state", state, {
    ...authConfig.cookieOptions,
    maxAge: authConfig.oauthStateTtlMs,
  });
};

const clearOAuthStateCookie = (res: Response): void => {
  res.clearCookie("oauth_state", authConfig.cookieOptions);
};

const consumeOAuthState = (
  queryState: unknown,
  cookieState: unknown,
  provider: "google" | "github"
): { valid: boolean; returnUrl?: string } => {
  if (typeof queryState !== "string") {
    return { valid: false };
  }

  const stored = oauthStateStore.consume(queryState);
  if (!stored || stored.provider !== provider) {
    return { valid: false };
  }

  // If cookie is present, verify match; otherwise rely on cryptographically secure server store
  if (typeof cookieState === "string" && cookieState !== queryState) {
    return { valid: false };
  }

  return { valid: true, returnUrl: stored.returnUrl };
};

const getReturnUrlFromRequest = (req: Request): string => {
  const referer = req.headers.referer;
  if (referer) {
    try {
      const parsed = new URL(referer);
      const origin = parsed.origin;
      if (appConfig.allowedOrigins.includes(origin)) {
        return origin;
      }
    } catch {
      // Ignore URL parsing errors
    }
  }
  return appConfig.frontendUrl;
};

const redirectToLogin = (res: Response, error: string, returnUrl?: string): void => {
  const target = returnUrl || appConfig.frontendUrl;
  res.redirect(`${target}/login?error=${encodeURIComponent(error)}`);
};

const trackFailedLogin = async (userId?: string): Promise<void> => {
  if (!userId) return;

  await prisma.user
    .update({
      where: { id: userId },
      data: {
        failedLoginCount: { increment: 1 },
        lastFailedLoginAt: new Date(),
      },
    })
    .catch((error) => console.error("Failed login tracking error:", error));
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateBody<RegisterRequest>(req.body, schemas.register);
    if (!validation.ok) {
      sendValidationError(res, validation.errors);
      return;
    }

    const { email, password } = validation.value;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, authConfig.bcryptWorkFactor);
    const user = await prisma.user.create({
      data: { 
        email, 
        passwordHash,
        provider: "local",
        providerId: email // Fallback for the unique composite key
      },
    });

    const token = signAuthToken(user.id);
    setAuthCookie(res, token);

    res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateBody<LoginRequest>(req.body, schemas.login);
    if (!validation.ok) {
      sendValidationError(res, validation.errors);
      return;
    }

    const { email, password } = validation.value;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: authConfig.failedLoginFailureMessage });
      return;
    }

    if (!user.passwordHash) {
      await trackFailedLogin(user.id);
      res.status(400).json({ error: authConfig.failedLoginFailureMessage });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      await trackFailedLogin(user.id);
      res.status(400).json({ error: authConfig.failedLoginFailureMessage });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        failedLoginCount: 0,
        lastFailedLoginAt: null,
      }
    });

    const token = signAuthToken(user.id);
    setAuthCookie(res, token);

    res.status(200).json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (_req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, image: true, role: true }
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Me endpoint error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const googleLoginRedirect = (req: Request, res: Response): void => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Google OAuth credentials not configured.");
    redirectToLogin(res, "OAuthNotConfigured");
    return;
  }

  const returnUrl = getReturnUrlFromRequest(req);
  const state = createOAuthState("google", returnUrl);
  setOAuthStateCookie(res, state);

  const scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.search = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: appConfig.googleRedirectUri,
    response_type: "code",
    scope,
    state,
  }).toString();
  
  res.redirect(authUrl.toString());
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  let returnUrl = appConfig.frontendUrl;
  try {
    const { code, state } = req.query;
    const savedState = req.cookies.oauth_state;

    const stateResult = consumeOAuthState(state, savedState, "google");
    if (!stateResult.valid) {
      clearOAuthStateCookie(res);
      redirectToLogin(res, "InvalidOAuthState");
      return;
    }
    clearOAuthStateCookie(res);

    if (stateResult.returnUrl) {
      returnUrl = stateResult.returnUrl;
    }

    if (!code || typeof code !== "string") {
      redirectToLogin(res, "InvalidGoogleCode", returnUrl);
      return;
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: appConfig.googleRedirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Token Exchange Error:", tokenData);
      redirectToLogin(res, "GoogleTokenExchangeFailed", returnUrl);
      return;
    }

    // Fetch user profile using the access token
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profileData = await profileResponse.json();
    if (!profileResponse.ok || !profileData.email) {
      redirectToLogin(res, "GoogleProfileFetchFailed", returnUrl);
      return;
    }

    const email = profileData.email;
    const googleId = profileData.id;
    const name = profileData.name || null;
    const image = profileData.picture || null;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          image,
          provider: "google",
          providerId: googleId,
          lastLoginAt: new Date()
        },
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: { 
          providerId: googleId, 
          provider: "google",
          name: user.name || name, // Update name if missing
          image: user.image || image, // Update image if missing
          lastLoginAt: new Date()
        }
      });
    }

    const token = signAuthToken(user.id);
    setAuthCookie(res, token);

    // Redirect to login with success flag (so frontend triggers the Granted animation)
    res.redirect(`${returnUrl}/login?success=true`);
  } catch (error) {
    console.error("Google Callback Error:", error);
    redirectToLogin(res, "InternalServerError", returnUrl);
  }
};

export const githubLoginRedirect = (req: Request, res: Response): void => {
  const client_id = process.env.GITHUB_CLIENT_ID || "";
  if (!client_id) {
    console.error("GitHub OAuth credentials not configured.");
    redirectToLogin(res, "OAuthNotConfigured");
    return;
  }

  const returnUrl = getReturnUrlFromRequest(req);
  const state = createOAuthState("github", returnUrl);
  setOAuthStateCookie(res, state);

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.search = new URLSearchParams({
    client_id,
    redirect_uri: appConfig.githubRedirectUri,
    scope: "user:email",
    state,
  }).toString();

  res.redirect(authUrl.toString());
};

export const githubCallback = async (req: Request, res: Response): Promise<void> => {
  let returnUrl = appConfig.frontendUrl;
  try {
    const { code, state } = req.query;
    const savedState = req.cookies.oauth_state;

    const stateResult = consumeOAuthState(state, savedState, "github");
    if (!stateResult.valid) {
      clearOAuthStateCookie(res);
      redirectToLogin(res, "InvalidOAuthState");
      return;
    }
    clearOAuthStateCookie(res);

    if (stateResult.returnUrl) {
      returnUrl = stateResult.returnUrl;
    }

    if (!code || typeof code !== "string") {
      redirectToLogin(res, "InvalidGithubCode", returnUrl);
      return;
    }

    const client_id = process.env.GITHUB_CLIENT_ID || "";
    const client_secret = process.env.GITHUB_CLIENT_SECRET || "";

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        redirect_uri: appConfig.githubRedirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("GitHub Token Exchange Failed:", tokenData);
      redirectToLogin(res, "GithubTokenExchangeFailed", returnUrl);
      return;
    }

    // Fetch GitHub user details
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "LearnOpto",
      },
    });
    const userData = await userRes.json();

    let email = userData.email;
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "LearnOpto",
        },
      });
      const emailsData = await emailsRes.json();
      if (Array.isArray(emailsData)) {
        const primary = emailsData.find((e: any) => e.primary && e.verified) || emailsData[0];
        if (primary) email = primary.email;
      }
    }

    if (!email) {
      redirectToLogin(res, "GithubEmailNotFound", returnUrl);
      return;
    }

    const githubId = String(userData.id);
    const name = userData.name || userData.login;
    const image = userData.avatar_url || null;

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          image,
          provider: "github",
          providerId: githubId,
          lastLoginAt: new Date(),
        },
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: {
          provider: "github",
          providerId: githubId,
          name: user.name || name,
          image: user.image || image,
          lastLoginAt: new Date(),
        },
      });
    }

    const token = signAuthToken(user.id);
    setAuthCookie(res, token);

    res.redirect(`${returnUrl}/login?success=true`);
  } catch (error) {
    console.error("Github Callback Error:", error);
    redirectToLogin(res, "InternalServerError", returnUrl);
  }
};
