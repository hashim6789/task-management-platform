import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { STATUS_ORDER, Task, TaskStatus, isValidTask } from "@/types";
import { api } from "@/lib";
import { RootState } from "../store";
import { AxiosError } from "axios";
import { isValid } from "date-fns";
import { io, Socket } from "socket.io-client";

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

// Initialize Socket.IO client (connected in TaskManagement component)
let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const fetchTasks = createAsyncThunk(
  "taskManagement/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { taskManagement, auth } = state;
    if (!auth.isAuthenticated || !auth.user) {
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
      const sanitizedTasks = response.data.data
        .filter(isValidTask)
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
      console.log("Sanitized Tasks:", sanitizedTasks);
      return { data: sanitizedTasks, total: response.data.total };
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
      dueDate: string;
      userId?: string;
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
      const task = response.data.data;
      // Emit Socket.IO event (fallback if backend doesn't emit)
      if (socket?.connected) {
        socket.emit("task:created", task);
      }
      return task;
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
    const { auth, taskManagement } = state;
    if (!auth.isAuthenticated || !auth.user) {
      return rejectWithValue("Unauthorized");
    }

    const task = taskManagement.tasks.find((t) => t._id === taskId);
    if (!task) {
      return rejectWithValue("Task not found");
    }

    const currentStatusIndex = STATUS_ORDER.indexOf(task.status);
    const newStatusIndex = STATUS_ORDER.indexOf(status);
    if (newStatusIndex <= currentStatusIndex && auth.user.role !== "admin") {
      return rejectWithValue("Cannot move status backward");
    }

    try {
      const response = await api.patch<{ data: Task; message: string }>(
        `/tasks/${taskId}`,
        { status }
      );
      const updatedTask = response.data.data;
      // Emit Socket.IO event (fallback)
      if (socket?.connected) {
        socket.emit("task:updated", updatedTask);
      }
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

export const assignTask = createAsyncThunk(
  "taskManagement/assignTask",
  async (
    { taskId, userId }: { taskId: string; userId: string | null },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      return rejectWithValue("Unauthorized");
    }

    try {
      const response = await api.patch<{ data: Task; message: string }>(
        `/tasks/${taskId}/assign`,
        { userId: userId || null }
      );
      const updatedTask = response.data.data;
      // Emit Socket.IO event (fallback)
      if (socket?.connected) {
        socket.emit("task:assigned", updatedTask);
      }
      return {
        taskId,
        userId,
        assignedTo: updatedTask.assignedTo,
        message: response.data.message,
      };
    } catch (error: unknown) {
      let errorMessage = "Failed to assign task";
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
} = taskManagementSlice.actions;
export const taskManagementReducer = taskManagementSlice.reducer;
