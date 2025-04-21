import jwt from "jsonwebtoken";
import { env } from "@/configs/env.config";

const ACCESS_TOKEN_EXPIRY = "7d";
const REFRESH_TOKEN_EXPIRY = "7d";

export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET as string, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as string, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET as string);
  return decoded;
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET as string);
  } catch (err) {
    console.error(err);
    return null;
  }
}
