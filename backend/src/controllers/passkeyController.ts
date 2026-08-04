import { Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { authConfig, passkeyConfig } from "../config/security";
import { setAuthCookie, signAuthToken } from "../utils/authSession";
import { schemas, sendValidationError, validateBody, validateEmptyBody } from "../utils/requestValidation";
import { TemporaryStore } from "../utils/temporaryStore";

// RP Settings
const rpName = passkeyConfig.rpName;
const rpID = passkeyConfig.rpID;
const expectedOrigin = passkeyConfig.expectedOrigins;
const passkeyChallengeStore = new TemporaryStore<{
  type: "registration" | "authentication";
  userId?: string;
}>();

type PasskeyRegistrationVerifyRequest = {
  id: string;
  rawId: string;
  response: Record<string, unknown>;
  type: "public-key";
  authenticatorAttachment?: string;
  clientExtensionResults?: Record<string, unknown>;
};

type PasskeyAuthenticationVerifyRequest = PasskeyRegistrationVerifyRequest;

const setChallengeCookie = (res: Response, challenge: string): void => {
  res.cookie("passkey_challenge", challenge, {
    ...authConfig.cookieOptions,
    maxAge: passkeyConfig.challengeTtlMs,
  });
};

const clearChallengeCookie = (res: Response): void => {
  res.clearCookie("passkey_challenge", authConfig.cookieOptions);
};

const consumeChallenge = (
  challenge: unknown,
  expectedType: "registration" | "authentication",
  userId?: string
): boolean => {
  if (typeof challenge !== "string" || !challenge) {
    return false;
  }

  const stored = passkeyChallengeStore.consume(challenge);
  if (!stored || stored.type !== expectedType) {
    return false;
  }

  return !userId || stored.userId === userId;
};

const validateNestedPasskeyResponse = (
  response: Record<string, unknown>,
  allowedFields: readonly string[],
  requiredStringFields: readonly string[]
): string[] => {
  const errors: string[] = [];
  const allowed = new Set(allowedFields);

  for (const key of Object.keys(response)) {
    if (!allowed.has(key)) {
      errors.push(`Unexpected property: response.${key}`);
    }
  }

  for (const field of requiredStringFields) {
    if (typeof response[field] !== "string" || response[field].length === 0) {
      errors.push(`response.${field} is required`);
    }
  }

  const transports = response.transports;
  if (transports !== undefined) {
    if (!Array.isArray(transports) || transports.some((transport) => typeof transport !== "string")) {
      errors.push("response.transports must be an array of strings");
    }
  }

  const publicKeyAlgorithm = response.publicKeyAlgorithm;
  if (publicKeyAlgorithm !== undefined && typeof publicKeyAlgorithm !== "number") {
    errors.push("response.publicKeyAlgorithm must be a number");
  }

  const userHandle = response.userHandle;
  if (userHandle !== undefined && userHandle !== null && typeof userHandle !== "string") {
    errors.push("response.userHandle must be a string or null");
  }

  return errors;
};

const trackFailedPasskeyLogin = async (userId: string): Promise<void> => {
  await prisma.user
    .update({
      where: { id: userId },
      data: {
        failedLoginCount: { increment: 1 },
        lastFailedLoginAt: new Date(),
      },
    })
    .catch((error) => console.error("Failed passkey login tracking error:", error));
};

/**
 * 1. Generate Registration Options
 * (User must be logged in via Google/Session to register a passkey)
 */
export const registerOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateEmptyBody(req.body);
    if (!validation.ok) {
      sendValidationError(res, validation.errors);
      return;
    }

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
    passkeyChallengeStore.set(
      options.challenge,
      { type: "registration", userId },
      passkeyConfig.challengeTtlMs
    );
    setChallengeCookie(res, options.challenge);

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
    const validation = validateBody<PasskeyRegistrationVerifyRequest>(
      req.body,
      schemas.passkeyRegistrationVerify
    );
    if (!validation.ok) {
      sendValidationError(res, validation.errors);
      return;
    }

    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const body = validation.value;
    const expectedChallenge = req.cookies.passkey_challenge;

    if (!consumeChallenge(expectedChallenge, "registration", userId)) {
      clearChallengeCookie(res);
      res.status(400).json({ error: "Challenge expired or not found" });
      return;
    }

    const nestedErrors = validateNestedPasskeyResponse(
      body.response,
      ["attestationObject", "clientDataJSON", "transports", "publicKey", "publicKeyAlgorithm", "authenticatorData"],
      ["attestationObject", "clientDataJSON"]
    );
    if (nestedErrors.length > 0) {
      clearChallengeCookie(res);
      sendValidationError(res, nestedErrors);
      return;
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: body as any,
        expectedChallenge,
        expectedOrigin,
        expectedRPID: rpID,
      });
    } catch (error) {
      clearChallengeCookie(res);
      res.status(400).json({ error: "Verification failed" });
      return;
    }

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
      clearChallengeCookie(res);

      res.status(200).json({ verified: true });
    } else {
      clearChallengeCookie(res);
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
    const validation = validateEmptyBody(req.body);
    if (!validation.ok) {
      sendValidationError(res, validation.errors);
      return;
    }

    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "preferred",
    });

    passkeyChallengeStore.set(
      options.challenge,
      { type: "authentication" },
      passkeyConfig.challengeTtlMs
    );
    setChallengeCookie(res, options.challenge);

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
    const validation = validateBody<PasskeyAuthenticationVerifyRequest>(
      req.body,
      schemas.passkeyAuthenticationVerify
    );
    if (!validation.ok) {
      sendValidationError(res, validation.errors);
      return;
    }

    const body = validation.value;
    const expectedChallenge = req.cookies.passkey_challenge;

    if (!consumeChallenge(expectedChallenge, "authentication")) {
      clearChallengeCookie(res);
      res.status(400).json({ error: "Challenge expired or not found" });
      return;
    }

    const nestedErrors = validateNestedPasskeyResponse(
      body.response,
      ["authenticatorData", "clientDataJSON", "signature", "userHandle"],
      ["authenticatorData", "clientDataJSON", "signature"]
    );
    if (nestedErrors.length > 0) {
      clearChallengeCookie(res);
      sendValidationError(res, nestedErrors);
      return;
    }

    // Find the passkey in database
    const passkey = await prisma.passkeyCredential.findUnique({
      where: { credentialID: body.id },
      include: { user: true },
    });

    if (!passkey) {
      clearChallengeCookie(res);
      res.status(404).json({ error: "Credential not found" });
      return;
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: body as any,
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
    } catch (error) {
      await trackFailedPasskeyLogin(passkey.userId);
      clearChallengeCookie(res);
      res.status(400).json({ error: "Verification failed" });
      return;
    }

    if (verification.verified && verification.authenticationInfo) {
      // Update counter to prevent replay attacks
      await prisma.passkeyCredential.update({
        where: { id: passkey.id },
        data: { counter: BigInt(verification.authenticationInfo.newCounter) },
      });

      // Clear the challenge
      clearChallengeCookie(res);

      // Update last login
      await prisma.user.update({
        where: { id: passkey.userId },
        data: {
          lastLoginAt: new Date(),
          failedLoginCount: 0,
          lastFailedLoginAt: null,
        },
      });

      // Issue JWT session
      const token = signAuthToken(passkey.userId);
      setAuthCookie(res, token);

      res.status(200).json({ verified: true, user: { id: passkey.user.id, email: passkey.user.email, name: passkey.user.name } });
    } else {
      await trackFailedPasskeyLogin(passkey.userId);
      clearChallengeCookie(res);
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

    const deleted = await prisma.passkeyCredential.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      res.status(404).json({ error: "Passkey not found or unauthorized" });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Remove Passkey Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
