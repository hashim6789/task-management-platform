import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { api } from "@/lib";
import { User } from "@/types";
import { AxiosError } from "axios";
import { UserMessages } from "@/constants";

export const fetchUsers = createAsyncThunk(
  "userManagement/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { userManagement, auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      return rejectWithValue(UserMessages.ADMIN_ONLY);
    }

    try {
      const params = {
        page: userManagement.page,
        limit: userManagement.limit,
        search: userManagement.search || undefined,

        isBlocked:
          userManagement.statusFilter === "active"
            ? false
            : userManagement.statusFilter === "blocked"
            ? true
            : "all",
        sortBy: userManagement.sortBy,
        sortOrder: userManagement.sortOrder,
      };
      const response = await api.get<{ data: User[]; total: number }>(
        "/users",
        { params }
      );
      // return { data: sampleUsers, total: 20 };
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
