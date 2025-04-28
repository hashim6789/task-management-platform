export type PriorityType = "high" | "normal" | "low";
export type StageType = "todo" | "in-progress" | "completed";

export interface Task {
  _id: string;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "completed";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: { _id: string; username: string } | null;
}
export type TaskStatus = "todo" | "in-progress" | "completed";
export const STATUS_ORDER: TaskStatus[] = ["todo", "in-progress", "completed"];
