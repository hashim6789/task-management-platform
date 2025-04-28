import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskStatus } from "@/types";
import {
  assignTask,
  createTask,
  fetchTasks,
  updateTaskStatus,
} from "../thunks";

interface TaskManagementState {
  tasks: Task[];
  isManagement: boolean;
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
  limit: 6,
  isManagement: false,
  search: "",
  statusFilter: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
  viewMode: "list",
  loading: false,
  error: null,
};

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
    updateTask: (state, action: PayloadAction<Task>) => {
      const updatedTask = action.payload;

      const existingTaskIndex = state.tasks.findIndex(
        (task) => task._id === updatedTask._id
      );
      if (existingTaskIndex >= 0) {
        state.tasks[existingTaskIndex] = {
          ...state.tasks[existingTaskIndex],
          ...updatedTask,
        };
      } else {
        state.tasks = [updatedTask, ...state.tasks];
        state.total += 1;
      }
    },
    setIsManagement: (state, action: PayloadAction<boolean>) => {
      state.isManagement = action.payload;
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
        state.tasks = action.payload.data as Task[];
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
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload.taskId
            ? { ...task, assignedTo: action.payload.assignedTo }
            : task
        );
      })
      .addCase(assignTask.rejected, (state, action) => {
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
  updateTask,
  setIsManagement,
} = taskManagementSlice.actions;
export const taskManagementReducer = taskManagementSlice.reducer;
