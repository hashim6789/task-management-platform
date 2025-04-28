import { ITask } from "@/models";
import { PaginatedData } from "@/types";
import {
  CreateTaskDTO,
  TaskPopulatedDTO,
  TaskQuery,
  TaskStatusType,
} from "@/types/task";

export interface ITaskService {
  createTask(data: CreateTaskDTO): Promise<ITask>;
  findTasks(query: TaskQuery): Promise<PaginatedData<TaskPopulatedDTO>>;
  findTasks(
    query: TaskQuery,
    id: string
  ): Promise<PaginatedData<TaskPopulatedDTO>>;
  assignToUser(id: string, userId: string): Promise<TaskPopulatedDTO | unknown>;
  changeStatus(
    id: string,
    userId: string,
    status: TaskStatusType
  ): Promise<TaskPopulatedDTO | unknown>;
}
