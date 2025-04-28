import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { api } from "@/lib";
import { Task } from "@/types";
import { isValid } from "date-fns";
import { AxiosError } from "axios";
import { AuthMessages, TaskMessages } from "@/constants";

export const fetchTasks = createAsyncThunk(
  "taskManagement/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { taskManagement, auth } = state;
    if (!auth.isAuthenticated || !auth.user) {
      return rejectWithValue(AuthMessages.USER_NOT_AUTHENTICATED);
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
      const response = await api.get<{ data: Task[]; total: number }>(
        "/tasks",
        { params }
      );
      const sanitizedTasks = response.data.data.map((task) => ({
        ...task,

        createdAt: isValid(new Date(task.createdAt))
          ? task.createdAt
          : new Date().toISOString(),
        updatedAt: isValid(new Date(task.updatedAt))
          ? task.updatedAt
          : new Date().toISOString(),
        assignedTo: task.assignedTo ?? undefined,
      }));
      return { data: sanitizedTasks, total: response.data.total };
    } catch (error: unknown) {
      let errorMessage = TaskMessages.FETCH_TASK_FAILED;
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);
