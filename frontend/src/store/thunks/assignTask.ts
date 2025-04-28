import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { api } from "@/lib";
import { Task } from "@/types";
import { AxiosError } from "axios";
import { TaskMessages, UserMessages } from "@/constants";

export const assignTask = createAsyncThunk(
  "taskManagement/assignTask",
  async (
    { taskId, userId }: { taskId: string; userId: string | null },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      return rejectWithValue(UserMessages.ADMIN_ONLY);
    }

    try {
      const response = await api.patch<Task>(`/tasks/${taskId}/assign`, {
        userId: userId || null,
      });
      return {
        taskId,
        userId,
        assignedTo: response.data.assignedTo,
        message: TaskMessages.ASSIGN_SUCCESS,
      };
    } catch (error: unknown) {
      let errorMessage = TaskMessages.ASSIGN_FAILED;
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);
