import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { api } from "@/lib";
import { AxiosError } from "axios";

export const toggleBlockUser = createAsyncThunk(
  "userManagement/toggleBlockUser",
  async (
    { userId, isBlocked }: { userId: string; isBlocked: boolean },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      return rejectWithValue("Unauthorized");
    }

    try {
      const response = await api.patch(`/users/${userId}`, {
        isBlocked: !isBlocked,
      });
      return { userId, isBlocked: !isBlocked, message: response.data.message };
    } catch (error: unknown) {
      let errorMessage = "Failed to update user status";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      return rejectWithValue(errorMessage);
    }
  }
);
