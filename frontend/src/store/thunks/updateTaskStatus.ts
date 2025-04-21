import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { api } from "@/lib";
import { STATUS_ORDER, Task, TaskStatus } from "@/types";
import { AxiosError } from "axios";

export const updateTaskStatus = createAsyncThunk(
  "taskManagement/updateTaskStatus",
  async (
    {
      taskId,
      status,
      userId,
    }: { taskId: string; status: TaskStatus; userId: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth, taskManagement } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "user") {
      console.log("Update task status failed: Unauthorized");
      return rejectWithValue("Unauthorized");
    }

    const task = taskManagement.tasks.find((t) => t._id === taskId);
    if (!task) {
      console.log("Update task status failed: Task not found", { taskId });
      return rejectWithValue("Task not found");
    }
    if (task.assignedTo?._id !== userId) {
      console.log("Update task status failed: User have no access to update", {
        taskId,
      });
      return rejectWithValue("user have no access");
    }

    const currentStatusIndex = STATUS_ORDER.indexOf(task.status);
    const newStatusIndex = STATUS_ORDER.indexOf(status);
    if (newStatusIndex <= currentStatusIndex && auth.user.role !== "user") {
      console.log("Update task status failed: Cannot move status backward", {
        taskId,
        status,
      });
      return rejectWithValue("Cannot move status backward");
    }

    try {
      console.log("Updating task status", { taskId, status });
      const response = await api.patch<{ data: Task; message: string }>(
        `/tasks/${taskId}`,
        {
          status,
        }
      );
      console.log("Task status updated", { taskId, status });
      return { taskId, status, message: response.data.message };
    } catch (error: unknown) {
      let errorMessage = "Failed to update task status";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      console.error("Update task status error", {
        taskId,
        error: errorMessage,
      });
      return rejectWithValue(errorMessage);
    }
  }
);
