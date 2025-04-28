import { AuthController } from "@/controllers/implementation";
import { IAuthController } from "@/controllers/interface";
import { validate, verifyTokenMiddleware } from "@/middlewares";
import UserModel from "@/models/user.model";
import { UserRepository } from "@/repositories/implementation";
import { IUserRepository } from "@/repositories/interface";
import { loginSchema } from "@/schema";
import { AuthService } from "@/services/implementation";
import { IAuthService } from "@/services/interface";
import { Router } from "express";

const authRouter = Router();

const userRepository: IUserRepository = new UserRepository(UserModel);
const authService: IAuthService = new AuthService(userRepository);
const authController: IAuthController = new AuthController(authService);

authRouter.post(
  "/refresh",
  authController.refreshAccessToken.bind(authController)
);

authRouter.get(
  "/me",
  verifyTokenMiddleware(["admin", "user"]),
  authController.me.bind(authController)
);

authRouter.post(
  "/login",
  validate(loginSchema),
  authController.login.bind(authController)
);
authRouter.post("/logout", authController.logout.bind(authController));

export { authRouter };
