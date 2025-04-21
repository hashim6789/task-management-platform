import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface DecodedUser extends JwtPayload {
  id: string;
  email: string;
  role: "user" | "admin";
}

// Extend Express Request type to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedUser;
  }
}

// Refresh Token Middleware (from cookies)
export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ error: "Refresh token missing" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as DecodedUser;

    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};
