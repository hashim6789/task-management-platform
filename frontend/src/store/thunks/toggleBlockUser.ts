import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { api } from "@/lib";
import { AxiosError } from "axios";
import { UserMessages } from "@/constants";

export const toggleBlockUser = createAsyncThunk(
  "userManagement/toggleBlockUser",
  async (
    { userId, isBlocked }: { userId: string; isBlocked: boolean },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      return rejectWithValue(UserMessages.ADMIN_ONLY);
    }

    try {
      const response = await api.patch(`/users/${userId}`, {
        isBlocked: !isBlocked,
      });
      return { userId, isBlocked: !isBlocked, message: response.data.message };
    } catch (error: unknown) {
      let errorMessage = UserMessages.UPDATE_FAILED;

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }

      return rejectWithValue(errorMessage);
    }
  }
);
