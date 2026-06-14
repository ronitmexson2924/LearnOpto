import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// RP Settings
const rpName = process.env.RP_NAME || "LearnOpto Passkeys";
const rpID = process.env.RP_ID || "localhost";
const expectedOrigin = process.env.ORIGIN || "http://localhost:8080";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Helper to set auth cookie after login
const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * 1. Generate Registration Options
 * (User must be logged in via Google/Session to register a passkey)
 */
export const registerOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { passkeys: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userPasskeys = user.passkeys || [];

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new Uint8Array(Buffer.from(user.id)),
      userName: user.email,
      attestationType: "none",
      excludeCredentials: userPasskeys.map((key: any) => ({
        id: key.credentialID,
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform", // FaceID / TouchID / Windows Hello
      },
    });

    // Save challenge in a cookie securely for verifying in the next step
    res.cookie("passkey_challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 1000, // 5 minutes
      sameSite: "lax",
    });

    res.status(200).json(options);
  } catch (error) {
    console.error("Register Options Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * 2. Verify Registration Response
 */
export const registerVerify = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const body = req.body;
    const expectedChallenge = req.cookies.passkey_challenge;

    if (!expectedChallenge) {
      res.status(400).json({ error: "Challenge expired or not found" });
      return;
    }

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      const {
        credential,
        credentialDeviceType,
        credentialBackedUp,
      } = verification.registrationInfo;

      // Save to database
      await prisma.passkeyCredential.create({
        data: {
          userId: userId,
          credentialID: credential.id,
          publicKey: Buffer.from(credential.publicKey),
          counter: BigInt(credential.counter),
          deviceType: credentialDeviceType,
          backedUp: credentialBackedUp,
          transports: JSON.stringify(body.response.transports || []),
        },
      });

      // Clear the challenge
      res.clearCookie("passkey_challenge");

      res.status(200).json({ verified: true });
    } else {
      res.status(400).json({ error: "Verification failed" });
    }
  } catch (error) {
    console.error("Register Verify Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * 3. Generate Authentication Options
 * (No login required, identifier-first or discoverable credentials)
 */
export const authenticateOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "preferred",
    });

    res.cookie("passkey_challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(200).json(options);
  } catch (error) {
    console.error("Authenticate Options Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * 4. Verify Authentication Response
 */
export const authenticateVerify = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const expectedChallenge = req.cookies.passkey_challenge;

    if (!expectedChallenge) {
      res.status(400).json({ error: "Challenge expired or not found" });
      return;
    }

    // Find the passkey in database
    const passkey = await prisma.passkeyCredential.findUnique({
      where: { credentialID: body.id },
      include: { user: true },
    });

    if (!passkey) {
      res.status(404).json({ error: "Credential not found" });
      return;
    }

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      credential: {
        id: passkey.credentialID,
        publicKey: new Uint8Array(passkey.publicKey),
        counter: Number(passkey.counter),
        transports: passkey.transports ? JSON.parse(passkey.transports) : undefined,
      },
    });

    if (verification.verified && verification.authenticationInfo) {
      // Update counter to prevent replay attacks
      await prisma.passkeyCredential.update({
        where: { id: passkey.id },
        data: { counter: BigInt(verification.authenticationInfo.newCounter) },
      });

      // Clear the challenge
      res.clearCookie("passkey_challenge");

      // Update last login
      await prisma.user.update({
        where: { id: passkey.userId },
        data: { lastLoginAt: new Date() },
      });

      // Issue JWT session
      const token = jwt.sign({ userId: passkey.userId }, JWT_SECRET, { expiresIn: "7d" });
      setAuthCookie(res, token);

      res.status(200).json({ verified: true, user: { id: passkey.user.id, email: passkey.user.email, name: passkey.user.name } });
    } else {
      res.status(400).json({ error: "Verification failed" });
    }
  } catch (error) {
    console.error("Authenticate Verify Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * 5. List Passkeys for Dashboard
 */
export const listPasskeys = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const passkeys = await prisma.passkeyCredential.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        deviceType: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(passkeys);
  } catch (error) {
    console.error("List Passkeys Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * 6. Remove Passkey
 */
export const removePasskey = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const id = req.params.id as string;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await prisma.passkeyCredential.delete({
      where: {
        id,
        userId: userId, // Security check
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Remove Passkey Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
