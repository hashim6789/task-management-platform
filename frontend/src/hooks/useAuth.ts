import { useAppDispatch } from "@/store/hook";
import { clearUser, setUser } from "@/store/slices/authSlice";
import { RootState } from "@/store";
import { ClientToServerEvents, ServerToClientEvents, User } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance, showToast, ToastType } from "@/lib";
import { Socket } from "socket.io-client";
import { disconnectSocket, initializeSocket } from "@/lib/socket";
import { AxiosError } from "axios";
import { AuthMessages } from "@/constants";

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const useAuth = (): AuthState => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize and connect Socket.IO
      const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
        initializeSocket(user._id, dispatch);
      socket.connect();

      // Cleanup on unmount
      return () => {
        disconnectSocket();
      };
    }
  }, [dispatch, isAuthenticated, user]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.post<User>("/auth/login", {
          email,
          password,
        });
        const user = response.data;

        await dispatch(setUser(user));
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }

        showToast({
          message: AuthMessages.LOGIN_SUCCESS,
          type: ToastType.SUCCESS,
        });
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          showToast({
            message: error.response?.data.error || AuthMessages.INVALID_EMAIL,
            type: ToastType.ERROR,
          });
        } else {
          showToast({
            message: AuthMessages.INVALID_EMAIL,
            type: ToastType.ERROR,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, navigate]
  );

  const logout = useCallback(async () => {
    try {
      const response = await axiosInstance.post("/auth/logout"); // Optional: Call logout endpoint
      dispatch(clearUser());
      showToast({
        message: response.data.message || AuthMessages.LOGOUT_SUCCESS,
        type: ToastType.SUCCESS,
      });
    } catch (error) {
      showToast({ message: AuthMessages.LOGIN_FAILED, type: ToastType.ERROR });
      console.error(AuthMessages.LOGIN_FAILED, error);
    }
  }, [dispatch]);

  return { user, login, logout, isLoading };
};
