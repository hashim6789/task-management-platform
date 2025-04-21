import { Router } from "express";

import { UserRepository } from "@/repositories/implementation";
import UserModel from "@/models/user.model";
import { IUserRepository } from "@/repositories/interface";
import { IUserService } from "@/services/interface";
import { UserService } from "@/services/implementation";
import { IUserController } from "@/controllers/interface";
import { UserController } from "@/controllers/implementation";
import { validate } from "@/middlewares";
import { blockUserSchema, createUserSchema } from "@/schema";
import verifyTokenMiddleware from "@/middlewares/verify-token.middleware";

const userRouter = Router();

const userRepository: IUserRepository = new UserRepository(UserModel);
const userService: IUserService = new UserService(userRepository);
const userController: IUserController = new UserController(userService);

userRouter.post(
  "/",

  verifyTokenMiddleware(["admin"]),
  validate(createUserSchema),
  userController.createUser.bind(userController)
);
userRouter.get(
  "/",
  verifyTokenMiddleware(["admin"]),
  userController.findUsers.bind(userController)
);
userRouter.patch(
  "/:id",
  verifyTokenMiddleware(["admin"]),
  validate(blockUserSchema),
  userController.blockUnblockUser.bind(userController)
);

export { userRouter };
