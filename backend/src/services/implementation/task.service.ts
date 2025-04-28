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
      title: { $regex: new RegExp(`^${data.title}$`, "i") },
    });

    if (existingTask) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.TASK_ALREADY_EXIST
      );
    }
    const task = this._taskRepository.create(data);

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

    if (!task) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TASK_NOT_FOUND);
    }

    const isOverdue =
      task.dueDate &&
      task.status !== "completed" &&
      new Date(task.dueDate) < new Date();

    if (task.assignedTo && !isOverdue) {
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

    const newDueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const assignedTask = await this._taskRepository.assignTaskToUser(taskId, {
      assignedTo: userId,
      dueDate: newDueDate,
    });

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
        if (status !== "in-progress") {
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            HttpResponse.ONLY_MOVE_TODO_TO_INPROGRESS
          );
        }
        break;

      case "in-progress":
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
