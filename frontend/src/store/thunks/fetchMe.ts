import { UserMessages } from "@/constants";
import { axiosInstance } from "@/lib";
import { User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// Thunk to fetch user data
export const fetchMe = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<User>("/auth/me");
      return response.data;
    } catch (error: unknown) {
      let errorMessage = UserMessages.FETCH_USER_FAILED;

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }

      return rejectWithValue(errorMessage);
    }
  }
);
