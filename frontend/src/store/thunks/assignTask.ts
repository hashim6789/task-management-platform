import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { api } from "@/lib";
import { Task } from "@/types";
import { AxiosError } from "axios";

export const assignTask = createAsyncThunk(
  "taskManagement/assignTask",
  async (
    { taskId, userId }: { taskId: string; userId: string | null },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      console.log("Assign task failed: Unauthorized");
      return rejectWithValue("Unauthorized");
    }

    try {
      console.log("Assigning task", { taskId, userId });
      const response = await api.patch<Task>(`/tasks/${taskId}/assign`, {
        userId: userId || null,
      });
      console.log("Task assigned", { taskId, userId });
      return {
        taskId,
        userId,
        assignedTo: response.data.assignedTo,
        message: "The task assigned successfully",
      };
    } catch (error: unknown) {
      let errorMessage = "Failed to assign task";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      console.error("Assign task error", { taskId, error: errorMessage });
      return rejectWithValue(errorMessage);
    }
  }
);
