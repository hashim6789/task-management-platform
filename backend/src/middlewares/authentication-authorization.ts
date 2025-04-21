import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { verifyAccessToken } from "@/utils";

dotenv.config();

type Role = "user" | "admin";

interface DecodedUser extends JwtPayload {
  id: string;
  email: string;
  role: Role;
}

// Extend Express Request type to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedUser;
  }
}

/**
 * Middleware to verify JWT access token and authorize based on roles
 * @param allowedRoles array of roles that are allowed to access the route
 */
export const authenticateAndAuthorization = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { accessToken } = req.cookies;

      if (!accessToken) {
        res.status(401).json({ message: "Access token missing" });
        return;
      }

      const decoded = verifyAccessToken(accessToken) as DecodedUser | null;
      console.log("access", decoded);

      if (!decoded) {
        res.status(401).json({ message: "Access token expired" });
        return;
      }

      if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: "Forbidden: You are not authorized" });
        return;
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ message: "Invalid or expired access token" });
    }
  };
};
