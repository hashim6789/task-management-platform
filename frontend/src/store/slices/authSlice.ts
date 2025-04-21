import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role, User } from "@/types";
import { fetchMe } from "../thunks";

interface AuthState {
  user: User | null;
  currentRole: Role;
  isAuthenticated: boolean;
  isBlocked: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  currentRole: "user",
  isAuthenticated: false,
  isBlocked: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      const user = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.isBlocked = user.isBlocked;
      state.currentRole = user.role;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.currentRole = "user";
      state.isBlocked = false;
      state.error = null;
    },
    blockUser: (state, action: PayloadAction<boolean>) => {
      state.isBlocked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isBlocked = action.payload.isBlocked;
        state.currentRole = action.payload.role;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        state.isAuthenticated = false;
        state.isBlocked = false;
        state.currentRole = "user";
      });
  },
});

export const { setUser, clearUser, blockUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
