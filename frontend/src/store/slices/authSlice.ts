import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role, User } from "../../types";

interface AuthState {
  user: User | null;
  currentRole: Role;
  isAuthenticated: boolean;
  isBlocked: boolean;
}

const initialState: AuthState = {
  user: null,
  currentRole: "user",
  isAuthenticated: false,
  isBlocked: true,
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

      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.error("Failed to store user in localStorage:", error);
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.currentRole = "user";

      try {
        localStorage.removeItem("user");
      } catch (error) {
        console.error("Failed to remove user from localStorage:", error);
      }
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
