import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { userManagementReducer } from "./slices/userManagentSlice";
import { taskManagementReducer } from "./slices/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userManagement: userManagementReducer,
    taskManagement: taskManagementReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
