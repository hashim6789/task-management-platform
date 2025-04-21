import { Request, Response, NextFunction } from "express";

export interface IAuthController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  // signup(req: Request, res: Response, next: NextFunction): Promise<void>
  // forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  // resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  me(req: Request, res: Response, next: NextFunction): Promise<void>;
}
