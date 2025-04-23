import { Task } from "./task";

export interface StatsCard {
  _id: string;
  label: string;
  total: number;
  icon: React.ReactNode;
  bg: string;
}

export function isValidTask(task: any): task is Task {
  return (
    task !== null &&
    task !== undefined &&
    typeof task._id === "string" &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    ["todo", "in-progress", "completed"].includes(task.status) &&
    typeof task.dueDate === "string" &&
    typeof task.createdAt === "string" &&
    typeof task.updatedAt === "string" &&
    (task.assignedTo === undefined ||
      (typeof task.assignedTo === "object" &&
        typeof task.assignedTo.username === "string"))
  );
}
