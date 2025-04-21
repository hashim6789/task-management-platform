import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt.util";
import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { createHttpError, HttpError } from "@/utils/http-error.util";
import { Role } from "@/types";

export default function (
  allowedRoles: Role[]
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { accessToken, refreshToken } = req.cookies;

      if (!accessToken || !refreshToken) {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN);
      }

      const payload = verifyAccessToken(accessToken) as {
        id: string;
        email: string;
        role: "user" | "admin";
      };

      if (!allowedRoles.includes(payload.role)) {
        throw createHttpError(
          HttpStatus.FORBIDDEN,
          HttpResponse.NO_ACCESS_RESOURCE
        );
      }

      req.headers["x-user-payload"] = JSON.stringify(payload);
      next();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: unknown) {
      console.error({ message: "Error in auth middleware", error: err });

      if (
        err instanceof HttpError &&
        err.statusCode === HttpStatus.UNAUTHORIZED
      ) {
        // Authentication error (e.g., missing or expired token)
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: err.message,
        });
      } else if (err instanceof Error && err.name === "TokenExpiredError") {
        // Authentication error (expired token specifically)
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: HttpResponse.TOKEN_EXPIRED,
        });
      } else if (
        err instanceof HttpError &&
        err.statusCode === HttpStatus.FORBIDDEN
      ) {
        // Authorization error
        res.status(HttpStatus.FORBIDDEN).json({
          message: err.message,
        });
      } else {
        // Fallback for unexpected errors
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: "An unexpected error occurred.",
        });
      }
    }
  };
}
