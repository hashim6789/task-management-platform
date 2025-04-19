import { Router } from "express";

import { UserRepository } from "@/repositories/implementation";
import UserModel from "@/models/user.model";
import { IUserRepository } from "@/repositories/interface";
import { IAuthService } from "@/services/interface";
import { AuthService } from "@/services/implementation";
import { IAuthController } from "@/controllers/interface";
import { AuthController } from "@/controllers/implementation/auth.controller";
import { validate } from "@/middlewares";
import { loginSchema } from "@/schema";

const authRouter = Router();

const userRepository: IUserRepository = new UserRepository(UserModel);
const authService: IAuthService = new AuthService(userRepository);
const authController: IAuthController = new AuthController(authService);

authRouter.post(
  "/refresh",
  authController.refreshAccessToken.bind(authController)
);

// authRouter.get(
//   "/me",
//   verifyToken('user'),
//   authController.me.bind(authController)
// );

authRouter.post(
  "/login",
  validate(loginSchema),
  authController.login.bind(authController)
);
authRouter.post("/logout", authController.logout.bind(authController));

export { authRouter };
