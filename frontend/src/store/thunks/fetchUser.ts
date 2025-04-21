import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { api } from "@/lib";
import { User } from "@/types";
import { AxiosError } from "axios";

export const fetchUsers = createAsyncThunk(
  "userManagement/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { userManagement, auth } = state;
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
      return rejectWithValue("Unauthorized");
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
            : undefined,
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
      let errorMessage = "Failed to fetch users";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      return rejectWithValue(errorMessage);
    }
  }
);
