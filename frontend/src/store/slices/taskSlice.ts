import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskStatus } from "@/types";
import { api } from "@/lib";
import { RootState } from "../store";
import { AxiosError } from "axios";

interface TaskManagementState {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  search: string;
  statusFilter: TaskStatus | "all";
  sortBy: keyof Task;
  sortOrder: "asc" | "desc";
  viewMode: "list" | "card";
  loading: boolean;
  error: string | null;
}

const initialState: TaskManagementState = {
  tasks: [],
  total: 0,
  page: 1,
  limit: 10,
  search: "",
  statusFilter: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
  viewMode: "list",
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "taskManagement/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { taskManagement, auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
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
      const response = await api.get<{ data: Task[]; total: number }>(
        "/tasks",
        { params }
      );
      return response.data;
      // return { data: sampleTasks, total: 20 };
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch tasks";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const createTask = createAsyncThunk(
  "taskManagement/createTask",
  async (
    taskData: {
      title: string;
      description: string;
      status: TaskStatus;
      assignedTo: string;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      return rejectWithValue("Unauthorized");
    }

    try {
      const response = await api.post<{ data: Task }>("/tasks", taskData);
      return response.data.data;
    } catch (error: unknown) {
      let errorMessage = "Failed to create task";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "taskManagement/updateTaskStatus",
  async (
    { taskId, status }: { taskId: string; status: TaskStatus },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      return rejectWithValue("Unauthorized");
    }

    try {
      const response = await api.patch(`/tasks/${taskId}`, { status });
      return { taskId, status, message: response.data.message };
    } catch (error: unknown) {
      let errorMessage = "Failed to update task status";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

const taskManagementSlice = createSlice({
  name: "taskManagement",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setStatusFilter: (state, action: PayloadAction<TaskStatus | "all">) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },

    setSort: (
      state,
      action: PayloadAction<{ sortBy: keyof Task; sortOrder: "asc" | "desc" }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setViewMode: (state, action: PayloadAction<"list" | "card">) => {
      state.viewMode = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks = [action.payload, ...state.tasks];
      state.total += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks = [action.payload, ...state.tasks];
        state.total += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload.taskId
            ? { ...task, status: action.payload.status }
            : task
        );
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearch,
  setStatusFilter,
  setSort,
  setPage,
  setLimit,
  setViewMode,
  clearError,
  addTask,
} = taskManagementSlice.actions;
export const taskManagementReducer = taskManagementSlice.reducer;
