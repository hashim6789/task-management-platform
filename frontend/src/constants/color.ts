import { TaskStatus } from "@/types";

// Status colors mapping
export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "bg-red-100 text-red-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
};
