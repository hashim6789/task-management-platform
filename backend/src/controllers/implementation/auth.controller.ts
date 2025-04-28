import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interface";
import { IAuthService } from "@/services/interface";
import { deleteCookie, setCookie } from "@/utils/refresh-cookie.util";
import { HttpResponse, HttpStatus } from "@/constants";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, username, password } = req.body;

      const { accessToken, refreshToken, user } = await this._authService.login(
        email || username,
        password
      );

      setCookie(res, refreshToken, "refreshToken");
      setCookie(res, accessToken, "accessToken");

      res.status(HttpStatus.OK).json(user);
    } catch (err) {
      next(err);
    }
  }

  async logout(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      deleteCookie(res, "refreshToken");
      deleteCookie(res, "accessToken");
      res.status(HttpStatus.OK).json({ message: HttpResponse.LOGOUT_SUCCESS });
    } catch (error) {
      next(error);
    }
  }

  async refreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      const { accessToken, refreshToken: newRefreshToken } =
        await this._authService.refreshAccessToken(refreshToken);

      setCookie(res, newRefreshToken, "accessToken");

      res.status(HttpStatus.OK).json({ token: accessToken });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = JSON.parse(req.headers["x-user-payload"] as string);
      const user = await this._authService.getUserById(id);

      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      next(error);
    }
  }
}
