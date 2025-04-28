import { ITask } from "@/models";
import { PaginatedData } from "@/types";
import { TaskPopulatedDTO, TaskQuery, TaskStatusType } from "@/types/task";
import mongoose from "mongoose";
import { IBaseRepository } from "./IBaseRepository";

export interface ITaskRepository extends IBaseRepository<ITask> {
  findTaskById(id: mongoose.Types.ObjectId): Promise<TaskPopulatedDTO | null>;
  findAllByQuery(query: TaskQuery): Promise<PaginatedData<TaskPopulatedDTO>>;
  findAllByQuery(
    query: TaskQuery,
    assignedBy: string
  ): Promise<PaginatedData<TaskPopulatedDTO>>;
  assignTaskToUser(
    id: mongoose.Types.ObjectId,
    data: Partial<ITask>
  ): Promise<TaskPopulatedDTO | null>;
  changeStatusOfTask(
    id: mongoose.Types.ObjectId,
    status: TaskStatusType
  ): Promise<TaskPopulatedDTO | null>;
}
