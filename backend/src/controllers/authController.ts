import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = "http://localhost:3000/api/auth/google/callback";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // 'strict' might break OAuth redirects depending on the browser, 'lax' is safer for top-level navigation
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        email, 
        passwordHash,
        provider: "local",
        providerId: email // Fallback for the unique composite key
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);

    res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    if (!user.passwordHash) {
      res.status(400).json({ error: "This account uses Google Login" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);

    res.status(200).json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
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
    res.redirect(`${FRONTEND_URL}/login?error=OAuthNotConfigured`);
    return;
  }

  // Generate CSRF state token
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60 * 1000, // 10 minutes
  });

  const scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
  
  res.redirect(authUrl);
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, state } = req.query;
    const savedState = req.cookies.oauth_state;

    // Validate CSRF state
    if (!state || state !== savedState) {
      res.redirect(`${FRONTEND_URL}/login?error=InvalidOAuthState`);
      return;
    }
    res.clearCookie("oauth_state");

    if (!code || typeof code !== "string") {
      res.redirect(`${FRONTEND_URL}/login?error=InvalidGoogleCode`);
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
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Token Exchange Error:", tokenData);
      res.redirect(`${FRONTEND_URL}/login?error=GoogleTokenExchangeFailed`);
      return;
    }

    // Fetch user profile using the access token
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profileData = await profileResponse.json();
    if (!profileResponse.ok || !profileData.email) {
      res.redirect(`${FRONTEND_URL}/login?error=GoogleProfileFetchFailed`);
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

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);

    // Redirect to login with success flag (so frontend triggers the Granted animation)
    res.redirect(`${FRONTEND_URL}/login?success=true`);
  } catch (error) {
    console.error("Google Callback Error:", error);
    res.redirect(`${FRONTEND_URL}/login?error=InternalServerError`);
  }
};
