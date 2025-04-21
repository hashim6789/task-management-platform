import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskStatus } from "@/types";

import { fetchTasks } from "../thunks/fetchTask";
import { createTask } from "../thunks/createTask";
import { updateTaskStatus } from "../thunks/updateTaskStatus";
import { assignTask } from "../thunks/assignTask";

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
  limit: 10,
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
      console.log("Set search", { search: action.payload });
    },
    setStatusFilter: (state, action: PayloadAction<TaskStatus | "all">) => {
      state.statusFilter = action.payload;
      state.page = 1;
      console.log("Set status filter", { statusFilter: action.payload });
    },
    setSort: (
      state,
      action: PayloadAction<{ sortBy: keyof Task; sortOrder: "asc" | "desc" }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      console.log("Set sort", {
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
      });
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
      console.log("Set page", { page: action.payload });
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
      console.log("Set limit", { limit: action.payload });
    },
    setViewMode: (state, action: PayloadAction<"list" | "card">) => {
      state.viewMode = action.payload;
      console.log("Set view mode", { viewMode: action.payload });
    },
    clearError: (state) => {
      state.error = null;
      console.log("Cleared error");
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const updatedTask = action.payload;
      console.log("task get", updatedTask);
      console.log("task assign", action.payload);
      const existingTaskIndex = state.tasks.findIndex(
        (task) => task._id === updatedTask._id
      );
      if (existingTaskIndex >= 0) {
        state.tasks[existingTaskIndex] = {
          ...state.tasks[existingTaskIndex],
          ...updatedTask,
        };
        console.log("Updated existing task", { taskId: updatedTask._id });
      } else {
        state.tasks = [updatedTask, ...state.tasks];
        state.total += 1;
        console.log("Added new task", { taskId: updatedTask._id });
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
        console.log("Fetch tasks pending");
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data as Task[];
        state.total = action.payload.total;
        console.log("Fetch tasks fulfilled", {
          taskCount: action.payload.data.length,
        });
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log("Fetch tasks rejected", { error: action.payload });
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks = [action.payload, ...state.tasks];
        state.total += 1;
        console.log("Create task fulfilled", { taskId: action.payload._id });
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload as string;
        console.log("Create task rejected", { error: action.payload });
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload.taskId
            ? { ...task, status: action.payload.status }
            : task
        );
        console.log("Update task status fulfilled", {
          taskId: action.payload.taskId,
          status: action.payload.status,
        });
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        console.log("Update task status rejected", { error: action.payload });
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload.taskId
            ? { ...task, assignedTo: action.payload.assignedTo }
            : task
        );
        console.log("Assign task fulfilled", {
          taskId: action.payload.taskId,
          userId: action.payload.userId,
        });
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.error = action.payload as string;
        console.log("Assign task rejected", { error: action.payload });
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
