import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";
import { RootState } from "../store";
import { AxiosError } from "axios";
import { api } from "@/lib";

interface UserManagementState {
  users: User[];
  total: number;
  page: number;
  limit: number;
  search: string;
  statusFilter: "all" | "active" | "blocked";
  sortBy: keyof User;
  sortOrder: "asc" | "desc";
  viewMode: "list" | "card";
  loading: boolean;
  error: string | null;
}

const initialState: UserManagementState = {
  users: [],
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

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },

    setStatusFilter: (
      state,
      action: PayloadAction<"all" | "active" | "blocked">
    ) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setSort: (
      state,
      action: PayloadAction<{ sortBy: keyof User; sortOrder: "asc" | "desc" }>
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
    addUser: (state, action: PayloadAction<User>) => {
      state.users = [action.payload, ...state.users];
      state.total += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (
          state,
          action: PayloadAction<{ data: User[]; total: number } | undefined>
        ) => {
          state.loading = false;
          if (action.payload) {
            const { data, total } = action.payload;
            state.users = data;
            state.total = total;
          } else {
            state.users = [];
            state.total = 0;
          }
        }
      )

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user._id === action.payload.userId
            ? { ...user, isBlocked: action.payload.isBlocked }
            : user
        );
      })
      .addCase(toggleBlockUser.rejected, (state, action) => {
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
  addUser,
} = userManagementSlice.actions;
export const userManagementReducer = userManagementSlice.reducer;
