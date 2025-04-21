import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { api } from "@/lib";
import { Task } from "@/types";
import { isValid } from "date-fns";
import { AxiosError } from "axios";

export const fetchTasks = createAsyncThunk(
  "taskManagement/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { taskManagement, auth } = state;
    if (!auth.isAuthenticated || !auth.user) {
      console.log("Fetch tasks failed: Unauthorized");
      return rejectWithValue("Unauthorized");
    }

    try {
      const params = {
        page: taskManagement.page,
        limit: taskManagement.limit,
        search: taskManagement.search || undefined,
        status:
          taskManagement.statusFilter !== "all"
            ? taskManagement.statusFilter
            : undefined,
        sortBy: taskManagement.sortBy,
        sortOrder: taskManagement.sortOrder,
      };
      console.log("Fetching tasks", { params });
      const response = await api.get<{ data: Task[]; total: number }>(
        "/tasks",
        { params }
      );
      const sanitizedTasks = response.data.data
        // .filter(isValidTask)
        .map((task) => ({
          ...task,
          dueDate: isValid(new Date(task.dueDate))
            ? task.dueDate
            : new Date().toISOString(),
          createdAt: isValid(new Date(task.createdAt))
            ? task.createdAt
            : new Date().toISOString(),
          updatedAt: isValid(new Date(task.updatedAt))
            ? task.updatedAt
            : new Date().toISOString(),
          assignedTo: task.assignedTo ?? undefined,
        }));
      console.log("response", sanitizedTasks);
      console.log("Sanitized tasks", { count: sanitizedTasks.length });
      return { data: sanitizedTasks, total: response.data.total };
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch tasks";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      console.error("Fetch tasks error", { error: errorMessage });
      return rejectWithValue(errorMessage);
    }
  }
);
