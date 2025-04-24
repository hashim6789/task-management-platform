import { Router } from "express";
import { UserRepository } from "@/repositories/implementation";
import UserModel from "@/models/user.model";
import { IUserRepository } from "@/repositories/interface";
import { IUserService } from "@/services/interface";
import { UserService } from "@/services/implementation";
import { IUserController } from "@/controllers/interface";
import { UserController } from "@/controllers/implementation";
import {
  validate,
  validateBlockedOrNot,
  verifyTokenMiddleware,
} from "@/middlewares";
import { blockUserSchema, createUserSchema } from "@/schema";

const userRouter = Router();

const userRepository: IUserRepository = new UserRepository(UserModel);
const userService: IUserService = new UserService(userRepository);
const userController: IUserController = new UserController(userService);

userRouter.post(
  "/",
  verifyTokenMiddleware(["admin"]),
  validateBlockedOrNot(),
  validate(createUserSchema),
  userController.createUser.bind(userController)
);
userRouter.get(
  "/",
  verifyTokenMiddleware(["admin"]),
  validateBlockedOrNot(),
  userController.findUsers.bind(userController)
);
userRouter.patch(
  "/:id",
  verifyTokenMiddleware(["admin"]),
  validateBlockedOrNot(),
  validate(blockUserSchema),
  userController.blockUnblockUser.bind(userController)
);

export { userRouter };
