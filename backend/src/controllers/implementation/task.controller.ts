import { NextFunction, Request, Response } from "express";
import { ITaskController } from "../interface";
import { ITaskService } from "@/services/interface";
import {
  AssignTaskRequestDTO,
  ChangeStatusTaskRequestDTO,
  CreateTaskRequestDTO,
} from "@/schema/task";
import { HttpStatus } from "@/constants";
import { TaskPopulatedDTO, TaskQuery } from "@/types/task";
import { PaginatedData } from "@/types";

export class TaskController implements ITaskController {
  constructor(private _taskService: ITaskService) {}

  async createTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body as CreateTaskRequestDTO;
      const createdTask = await this._taskService.createTask(data);
      res.status(HttpStatus.CREATED).json(createdTask);
    } catch (error) {
      next(error);
    }
  }

  async findTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = req.query as unknown as TaskQuery;
      // console.log(query);
      const { id, role } = JSON.parse(req.headers["x-user-payload"] as string);
      console.log(id, role);
      let data: PaginatedData<TaskPopulatedDTO> = { data: [], total: 0 };
      if (role === "admin") {
        data = await this._taskService.findTasks(query);
      } else {
        data = await this._taskService.findTasks(query, id);
      }
      res.status(HttpStatus.OK).json(data);
    } catch (err) {
      next(err);
    }
  }

  async assignTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const TaskId = req.params.taskId;
      const updateData = req.body as AssignTaskRequestDTO;
      const updatedTask = await this._taskService.assignToUser(
        TaskId,
        updateData.userId
      );

      res.status(HttpStatus.OK).json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  async changeStatusOfTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const TaskId = req.params.taskId;
      const { status } = req.body as ChangeStatusTaskRequestDTO;
      const { id: userId } = JSON.parse(
        req.headers["x-user-payload"] as string
      );
      const updatedTask = await this._taskService.changeStatus(
        TaskId,
        userId,
        status
      );

      res.status(HttpStatus.OK).json(updatedTask);
    } catch (error) {
      next(error);
    }
  }
}
