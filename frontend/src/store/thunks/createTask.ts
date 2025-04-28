import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { api } from "@/lib";
import { Task } from "@/types";
import { AxiosError } from "axios";
import { TaskMessages, UserMessages } from "@/constants";

export const createTask = createAsyncThunk(
  "taskManagement/createTask",
  async (
    taskData: {
      title: string;
      description: string;
      // dueDate: string;
      // userId?: string;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      return rejectWithValue(UserMessages.ADMIN_ONLY);
    }

    try {
      const response = await api.post<Task>("/tasks", taskData);
      return response.data;
    } catch (error: unknown) {
      let errorMessage = TaskMessages.CREATE_FAILED;
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);
