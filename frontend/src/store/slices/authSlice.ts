import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role, User } from "../../types";

interface AuthState {
  user: User | null;
  currenntRole: Role;
  isAuthenticated: boolean;
  isBlocked: boolean;
}

const initialState: AuthState = {
  user: null,
  currenntRole: "user",
  isAuthenticated: false,
  isBlocked: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
