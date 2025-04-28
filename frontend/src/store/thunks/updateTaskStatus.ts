import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { api } from "@/lib";
import { STATUS_ORDER, Task, TaskStatus } from "@/types";
import { AxiosError } from "axios";
import { AuthMessages, TaskMessages, UserMessages } from "@/constants";

export const updateTaskStatus = createAsyncThunk(
  "taskManagement/updateTaskStatus",
  async (
    {
      taskId,
      status,
      userId,
    }: { taskId: string; status: TaskStatus; userId: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth, taskManagement } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "user") {
      return rejectWithValue(UserMessages.ADMIN_ONLY);
    }

    const task = taskManagement.tasks.find((t) => t._id === taskId);
    if (!task) {
      return rejectWithValue(TaskMessages.TASK_NOT_FOUND);
    }
    if (task.assignedTo?._id !== userId) {
      return rejectWithValue(AuthMessages.USER_NOT_ACCESS);
    }

    const currentStatusIndex = STATUS_ORDER.indexOf(task.status);
    const newStatusIndex = STATUS_ORDER.indexOf(status);
    if (newStatusIndex <= currentStatusIndex && auth.user.role !== "user") {
      return rejectWithValue(TaskMessages.TASK_CANT_MOVE_BACKWARD);
    }

    try {
      const response = await api.patch<{ data: Task; message: string }>(
        `/tasks/${taskId}`,
        {
          status,
        }
      );
      return { taskId, status, message: response.data.message };
    } catch (error: unknown) {
      let errorMessage = TaskMessages.UPDATE_FAILED;
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);
