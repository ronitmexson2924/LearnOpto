import { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { authConfig } from "../config/security";

export const signAuthToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: authConfig.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign({ userId }, authConfig.jwtSecret, options);
};

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    ...authConfig.cookieOptions,
    maxAge: authConfig.cookieMaxAgeMs,
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie("token", authConfig.cookieOptions);
};
