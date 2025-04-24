import { TaskController } from "@/controllers/implementation/task.controller";
import { ITaskController } from "@/controllers/interface";
import {
  validate,
  validateBlockedOrNot,
  verifyTokenMiddleware,
} from "@/middlewares";
import TaskModel from "@/models/task.model";
import UserModel from "@/models/user.model";
import { TaskRepository, UserRepository } from "@/repositories/implementation";
import { ITaskRepository, IUserRepository } from "@/repositories/interface";
import {
  assignTaskSchema,
  changeStatusTaskSchema,
  createTaskSchema,
} from "@/schema/task";
import { TaskService } from "@/services/implementation";
import { ITaskService } from "@/services/interface";
import { Router } from "express";

const taskRouter = Router();

const taskRepository: ITaskRepository = new TaskRepository(TaskModel);
const userRepository: IUserRepository = new UserRepository(UserModel);

const taskService: ITaskService = new TaskService(
  taskRepository,
  userRepository
);
const taskController: ITaskController = new TaskController(taskService);

taskRouter.post(
  "/",
  verifyTokenMiddleware(["admin"]),
  validateBlockedOrNot(),
  validate(createTaskSchema),
  taskController.createTask.bind(taskController)
);
taskRouter.get(
  "/",
  verifyTokenMiddleware(["admin", "user"]),
  validateBlockedOrNot(),
  taskController.findTasks.bind(taskController)
);
taskRouter.patch(
  "/:taskId/assign",
  verifyTokenMiddleware(["admin"]),
  validateBlockedOrNot(),
  validate(assignTaskSchema),
  taskController.assignTask.bind(taskController)
);
taskRouter.patch(
  "/:taskId",
  verifyTokenMiddleware(["user"]),
  validateBlockedOrNot(),
  validate(changeStatusTaskSchema),
  taskController.changeStatusOfTask.bind(taskController)
);

export { taskRouter };
