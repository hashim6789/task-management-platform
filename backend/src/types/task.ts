export interface TaskQuery {
  page: string;
  limit: string;
  search: string;
  isBlocked: string;
  sortBy: string;
  sortOrder: "desc" | "asc";
  status: "all" | TaskStatusType;
}
export type TaskStatusType = "todo" | "in-progress" | "completed";

import { CreateTaskRequestDTO } from "@/schema/task";
import { UserDTO } from "./user";

export type CreateTaskDTO = CreateTaskRequestDTO;
// export type BlockTaskDTO = BlockUserRequestDTO & { id: string };

export interface TaskPopulatedDTO {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  assignedTo?: UserDTO;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
// export interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   status: "todo" | "in-progress" | "completed";
//   assignedTo: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
