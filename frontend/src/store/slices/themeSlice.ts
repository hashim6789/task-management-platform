import { ThemeType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
  mode: ThemeType;
  isSidebarOpen: boolean;
}

const initialState: LayoutState = {
  mode: "light",
  isSidebarOpen: true,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeType>) {
      state.mode = action.payload;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
