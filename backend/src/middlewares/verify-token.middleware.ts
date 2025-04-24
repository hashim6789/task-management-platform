import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt.util";
import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { createHttpError, HttpError } from "@/utils/http-error.util";
import { Role } from "@/types";

type DecodedToken = {
  id: string;
  email: string;
  role: "admin" | "user";
};

export function verifyTokenMiddleware(
  allowedRoles: Role[]
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { accessToken, refreshToken } = req.cookies;

      if (!accessToken || !refreshToken) {
        throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN);
      }

      const result = verifyAccessToken(accessToken);
      if (!result.valid) {
        if (result.expired) {
          throw createHttpError(
            HttpStatus.UNAUTHORIZED,
            HttpResponse.TOKEN_EXPIRED
          );
        } else {
          throw createHttpError(
            HttpStatus.UNAUTHORIZED,
            HttpResponse.INVALID_ACCESS_TOKEN
          );
        }
      }

      const payload = result.decoded as DecodedToken;

      if (!allowedRoles.includes(payload.role)) {
        throw createHttpError(
          HttpStatus.FORBIDDEN,
          HttpResponse.NO_ACCESS_RESOURCE
        );
      }

      req.headers["x-user-payload"] = JSON.stringify(payload);
      next();

      // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: unknown) {
      console.error({ message: "Error in auth middleware", error: err });

      if (err instanceof HttpError) {
        res.status(err.statusCode).json({
          message: err.message,
        });
      }
    }
  };
}
