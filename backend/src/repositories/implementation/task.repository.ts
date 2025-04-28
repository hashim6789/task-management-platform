import { ITask } from "@/models";
import mongoose, { FilterQuery, Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { ITaskRepository } from "../interface";
import { TaskPopulatedDTO, TaskQuery, TaskStatusType } from "@/types/task";
import { PaginatedData, UserDTO } from "@/types";
import { toObjectId } from "@/utils";

export class TaskRepository
  extends BaseRepository<ITask>
  implements ITaskRepository
{
  constructor(model: Model<ITask>) {
    super(model);
  }

  async findAllByQuery(
    query: TaskQuery,
    assignedTo?: string
  ): Promise<PaginatedData<TaskPopulatedDTO>> {
    const {
      page = "1",
      limit = "10",
      search = "",
      status = "all",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const filter: FilterQuery<ITask> = {};

    // Filter by status only if it's not "all"
    if (status !== "all") {
      filter.status = status as ITask["status"];
    }

    if (assignedTo) {
      filter.assignedTo = toObjectId(
        assignedTo
      ) as unknown as ITask["assignedTo"];
    }

    // Apply search filter on title
    if (search) {
      filter.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };
    console.log("query", query);
    console.log("filter", filter);

    const tasks = await this.model
      .find(filter)
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate({
        path: "assignedTo",
        select: "username email createdAt updatedAt",
      });

    const data = tasks.map((task) => {
      const id = task._id.toString();
      const assignedTo = task.assignedTo as unknown as UserDTO;

      return {
        _id: id,
        title: task.title,
        description: task.description,
        status: task.status,
        assignedTo: assignedTo,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      };
    });

    const total = await this.model.countDocuments(filter);
    console.log(data, total);

    return { data, total };
  }

  async assignTaskToUser(
    id: mongoose.Types.ObjectId,
    data: Partial<ITask>
  ): Promise<TaskPopulatedDTO | null> {
    try {
      const assignedTask = await this.model
        .findByIdAndUpdate(id, data, { new: true })
        .populate({
          path: "assignedTo",
          select: "username email createdAt updatedAt",
        });

      if (!assignedTask) return null;

      // Use the modular conversion function
      return toTaskPopulatedDTO(
        assignedTask as unknown as ITask & { assignedTo: UserDTO }
      );
    } catch (error: unknown) {
      console.error("Error assigning task:", error);
      throw new Error("Error assigning task");
    }
  }
  async changeStatusOfTask(
    id: mongoose.Types.ObjectId,
    status: TaskStatusType
  ): Promise<TaskPopulatedDTO | null> {
    try {
      const updatedTask = await this.model
        .findByIdAndUpdate(id, { status }, { new: true })
        .populate({
          path: "assignedTo",
          select: "username email createdAt updatedAt",
        });

      if (!updatedTask) return null;

      // Use the modular conversion function
      return toTaskPopulatedDTO(
        updatedTask as unknown as ITask & { assignedTo: UserDTO }
      );
    } catch (error: unknown) {
      console.error("Error change status of task:", error);
      throw new Error("Error change status of task");
    }
  }
  async findTaskById(
    id: mongoose.Types.ObjectId
  ): Promise<TaskPopulatedDTO | null> {
    try {
      const task = await this.model.findById(id).populate({
        path: "assignedTo",
        select: "username email createdAt updatedAt",
      });

      if (!task) return null;

      // Use the modular conversion function
      return toTaskPopulatedDTO(
        task as unknown as ITask & { assignedTo: UserDTO }
      );
    } catch (error: unknown) {
      console.error("Error find task:", error);
      throw new Error("Error find task");
    }
  }
}

// Helper function to convert a task document to TaskPopulatedDTO
export function toTaskPopulatedDTO(
  task: ITask & { assignedTo: UserDTO }
): TaskPopulatedDTO {
  return {
    _id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    assignedTo: task.assignedTo,
    createdAt: task.createdAt,
    dueDate: task.dueDate,
    updatedAt: task.updatedAt,
  };
}
