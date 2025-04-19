import { api } from "@/lib";
import { User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Thunk to fetch user data
export const fetchMe = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ data: User }>("/auth/me");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);
