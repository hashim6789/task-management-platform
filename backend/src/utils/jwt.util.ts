import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "@/configs/env.config";
import { createHttpError } from "./http-error.util";
import { HttpResponse, HttpStatus } from "@/constants";

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
  try {
    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET as string
    ) as jwt.JwtPayload;
    return { valid: true, expired: false, decoded };
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return { valid: false, expired: true, decoded: null };
    } else if (err instanceof JsonWebTokenError) {
      return { valid: false, expired: false, decoded: null };
    }

    throw err; // unexpected error
  }
}
export function verifyRefreshToken(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      env.JWT_REFRESH_SECRET as string
    ) as jwt.JwtPayload;
    return { valid: true, expired: false, decoded };
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return { valid: false, expired: true, decoded: null };
    } else if (err instanceof JsonWebTokenError) {
      return { valid: false, expired: false, decoded: null };
    }

    throw err; // unexpected error
  }
}

// export function verifyRefreshToken(token: string) {
//   try {
//     return jwt.verify(token, env.JWT_REFRESH_SECRET as string);
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }
