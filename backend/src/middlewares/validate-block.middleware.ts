import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response-message.constant";
import formatZodErrors from "@/utils/format-zod-error.util";
import { UserRepository } from "@/repositories/implementation";
import UserModel from "@/models/user.model";
import { createHttpError, HttpError } from "@/utils";

export const validateBlockedOrNot =
  () =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = JSON.parse(req.headers["x-user-payload"] as string);
      console.log("id", id);
      const user = await new UserRepository(UserModel).findById(id);
      console.log("user", user);
      if (!user || user.isBlocked) {
        createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_BLOCKED);
      }
      next();
    } catch (error) {
      if (error instanceof HttpError) {
        console.log(error);
        res.status(HttpStatus.BAD_REQUEST).json({
          error: HttpResponse.USER_BLOCKED,
        });
      }
    }
  };
