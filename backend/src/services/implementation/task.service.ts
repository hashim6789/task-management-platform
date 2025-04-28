// import { HttpResponse, HttpStatus } from "@/constants";
// import { ITaskService } from "../interface/ITaskService";
// import { ITaskModel } from "@/models/implementation/Task.model";
// import { TaskRepository } from "@/repositories/implementation/Task.repository";
// import { createHttpError, uploadToCloudinary } from "@/utils";
// import { Types } from "mongoose";
// import { IUserRepository } from "@/repositories/interface/IUserRepository";
// import { ITaskRepository } from "@/repositories/interface/ITaskRepository";
// import { v4 as uuidv4 } from "uuid";

import { ITaskRepository, IUserRepository } from "@/repositories/interface";
import { ITaskService } from "../interface";
import { ITask } from "@/models";
import {
  CreateTaskDTO,
  TaskPopulatedDTO,
  TaskQuery,
  TaskStatusType,
} from "@/types/task";
import { PaginatedData } from "@/types";
import mongoose from "mongoose";
import { createHttpError } from "@/utils";
import { HttpResponse, HttpStatus } from "@/constants";
import { getIo } from "@/configs/socket.config";

export class TaskService implements ITaskService {
  private _taskRepository: ITaskRepository;
  private _userRepository: IUserRepository;

  constructor(
    _taskRepository: ITaskRepository,
    _userRepository: IUserRepository
  ) {
    this._taskRepository = _taskRepository;
    this._userRepository = _userRepository;
  }

  async createTask(data: CreateTaskDTO): Promise<ITask> {
    const existingTask = await this._taskRepository.findOne({
      title: { $regex: new RegExp(data.title, "i") },
    });

    if (existingTask) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.TASK_ALREADY_EXIST
      );
    }
    const task = this._taskRepository.create(data);
    // const io = getIo();
    // if(io)
    // io.of("/real").emit("task:created", task);

    return task;
  }

  async findTasks(
    query: TaskQuery,
    id?: string
  ): Promise<PaginatedData<TaskPopulatedDTO>> {
    if (id) return await this._taskRepository.findAllByQuery(query, id);
    else return await this._taskRepository.findAllByQuery(query);
  }

  async assignToUser(
    id: string,
    userId: string
  ): Promise<TaskPopulatedDTO | unknown> {
    const taskId = new mongoose.Types.ObjectId(id);
    const task = await this._taskRepository.findById(taskId);
    console.log("existing task", task);
    if (!task || (task.assignedTo && task.assignedTo !== null)) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.TASK_ALREADY_ASSIGNED
      );
    }

    const user = await this._userRepository.findById(userId);
    if (!user || user.isBlocked) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.USER_BLOCKED_OR_NOT_FOUND
      );
    }
    const assignedTask = await this._taskRepository.assignTaskToUser(
      taskId,
      userId
    );
    if (!assignedTask) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TASK_NOT_FOUND);
    }
    const io = getIo();
    if (io) io.of("/real").emit("task:assigned", assignedTask);
    return assignedTask;
  }

  async changeStatus(
    id: string,
    userId: string,
    status: TaskStatusType
  ): Promise<TaskPopulatedDTO | unknown> {
    const taskId = new mongoose.Types.ObjectId(id);
    const existingTask = await this._taskRepository.findTaskById(taskId);
    if (!existingTask) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TASK_NOT_FOUND);
    }

    console.log(existingTask.assignedTo?._id.toString() === userId);
    if (
      existingTask.assignedTo &&
      existingTask.assignedTo._id.toString() !== userId
    ) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.NO_ACCESS_RESOURCE
      );
    }

    if (existingTask.status === status) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.ALREADY_ON_STATUS
      );
    }

    switch (existingTask.status) {
      case "todo":
        // The only valid status change for "todo" is to "in-progress"
        if (status !== "in-progress") {
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            HttpResponse.ONLY_MOVE_TODO_TO_INPROGRESS
          );
        }
        break;

      case "in-progress":
        // The only valid status change for "in-progress" is to "completed"
        if (status !== "completed") {
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            HttpResponse.ONLY_MOVE_INPROGRESS_COMPLETED
          );
        }
        break;

      case "completed":
        if (status !== "completed") {
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            HttpResponse.CANT_CHANGE_STATUS
          );
        } else {
          // "completed" status cannot be changed
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            HttpResponse.ALREADY_ON_STATUS
          );
        }

      default:
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          HttpResponse.INVALID_TASK_STATUS
        );
    }

    const updatedTask = await this._taskRepository.changeStatusOfTask(
      taskId,
      status
    );
    if (!updatedTask) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TASK_NOT_FOUND);
    }

    const io = getIo();
    if (io) io.of("/real").emit("task:assigned", updatedTask);

    return updatedTask;
  }
}
