import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { api } from "@/lib";
import { Task } from "@/types";
import { AxiosError } from "axios";

export const createTask = createAsyncThunk(
  "taskManagement/createTask",
  async (
    taskData: {
      title: string;
      description: string;
      dueDate: string;
      userId?: string;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      console.log("Create task failed: Unauthorized");
      return rejectWithValue("Unauthorized");
    }

    try {
      console.log("Creating task", { title: taskData.title });
      const response = await api.post<Task>("/tasks", taskData);
      console.log("Task created", { taskId: response.data._id });
      return response.data;
    } catch (error: unknown) {
      let errorMessage = "Failed to create task";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      console.error("Create task error", { error: errorMessage });
      return rejectWithValue(errorMessage);
    }
  }
);
