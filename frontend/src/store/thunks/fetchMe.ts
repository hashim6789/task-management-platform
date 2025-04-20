import { api } from "@/lib";
import { User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// Thunk to fetch user data
export const fetchMe = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User>("/auth/me");
      return response.data;
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch user data";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      return rejectWithValue(errorMessage);
    }
  }
);
