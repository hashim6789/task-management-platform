import { Router } from "express";

import { UserRepository } from "@/repositories/implementation";
import UserModel from "@/models/user.model";
import { IUserRepository } from "@/repositories/interface";
import { IUserService } from "@/services/interface";
import { UserService } from "@/services/implementation";
import { IUserController } from "@/controllers/interface";
import { UserController } from "@/controllers/implementation";

const userRouter = Router();

const userRepository: IUserRepository = new UserRepository(UserModel);
const userService: IUserService = new UserService(userRepository);
const userController: IUserController = new UserController(userService);

userRouter.post("/", userController.createUser.bind(userController));

export { userRouter };
