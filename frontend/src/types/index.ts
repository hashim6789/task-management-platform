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
  description: string;
  status: TaskStatus;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
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
