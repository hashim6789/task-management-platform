import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";
import { fetchUsers, toggleBlockUser } from "../thunks";

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
  limit: 6,
  search: "",
  statusFilter: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
  viewMode: "list",
  loading: false,
  error: null,
};

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
