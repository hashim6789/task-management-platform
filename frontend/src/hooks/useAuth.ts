import { useAppDispatch } from "@/store/hiook";
import { clearUser, setUser } from "@/store/slices/authSlice";
import { RootState } from "@/store";
import { ClientToServerEvents, ServerToClientEvents, User } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { axiosInstance } from "@/lib";
import { Socket } from "socket.io-client";
import { disconnectSocket, initializeSocket } from "@/lib/socket";
import { AxiosError } from "axios";

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
        console.debug("Cleaning up TaskManagement");
        disconnectSocket();
      };
    }
  }, [dispatch, isAuthenticated, user]);

  const login = useCallback(async (email: string, password: string) => {
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
      toast.success("Login successful!");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error || "Invalid email or password");
      } else {
        toast.error("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await axiosInstance.post("/auth/logout"); // Optional: Call logout endpoint
      dispatch(clearUser());
      toast.success(response.data.message || "Logout successful!");
    } catch (error) {
      toast.error("Logout failed!");
      console.error("Logout error:", error);
    }
  }, []);

  return { user, login, logout, isLoading };
};
