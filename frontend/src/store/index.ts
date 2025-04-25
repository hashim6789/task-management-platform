import { configureStore } from "@reduxjs/toolkit";
import { authReducer, taskManagementReducer, themeReducer } from "./slices";
import { userManagementReducer } from "./slices/userManagementSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userManagement: userManagementReducer,
    taskManagement: taskManagementReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
