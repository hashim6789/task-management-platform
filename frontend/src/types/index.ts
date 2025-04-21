import type React from "react";

export type Role = "admin" | "user";

export type PriorityType = "high" | "normal" | "low";
export type StageType = "todo" | "in-progress" | "completed";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: Role;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// export interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   date: string;
//   priority: PriorityType;
//   stage: StageType;
//   assigneeId: string;
//   assignee?: User;
//   createdBy: string;
//   isTrashed: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

export type TaskStatus = "todo" | "in-progress" | "completed";

export interface Task {
  _id: string;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "completed";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: { _id: string; username: string } | null;
}

export interface StatsCard {
  _id: string;
  label: string;
  total: number;
  icon: React.ReactNode;
  bg: string;
}

export interface ThemeConfig {
  primary: string;
  accent: string;
  background: string;
}

export interface ThemeOptions {
  admin: ThemeConfig;
  user: ThemeConfig;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
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

export const STATUS_ORDER: TaskStatus[] = ["todo", "in-progress", "completed"];
