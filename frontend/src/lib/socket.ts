import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import { Task } from "@/types";
import { AppDispatch } from "@/store";
import { updateTask } from "@/store/slices/taskSlice";
import { blockUser } from "@/store/slices/authSlice";
import { env } from "@/configs";

// Define server-to-client events
interface ServerToClientEvents {
  "task:created": (task: Task) => void;
  "task:updated": (task: Task) => void;
  "task:assigned": (task: Task) => void;
  "user:blocked": (userId: string, isBlocked: boolean) => void;
  connect: () => void;
  connect_error: (error: Error) => void;
  disconnect: () => void;
}

// Define client-to-server events
interface ClientToServerEvents {
  login: (
    userId: string,
    callback: (success: boolean, message?: string) => void
  ) => void;
  "task:created": (task: Task) => void;
  "task:updated": (task: Task) => void;
  "task:assigned": (task: Task) => void;
  "user:blocked": (userId: string) => void;
}

// Define the socket with custom event types
let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const initializeSocket = (
  userId: string,
  dispatch: AppDispatch
): Socket<ServerToClientEvents, ClientToServerEvents> => {
  if (!socket) {
    socket = io(`${env.SERVER_ORIGIN}/real`, {
      auth: { userId },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected", { socketId: socket?.id, userId });
      // Emit login event upon connection
      socket?.emit("login", userId, (success, message) => {
        if (success) {
          console.log("Login successful", { userId });
        } else {
          console.error("Login failed", { userId, message });
        }
      });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error", { error: error.message });
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected", { socketId: socket?.id });
    });

    socket.on("task:created", (task: Task) => {
      console.log("Received task:created", {
        taskId: task._id,
        title: task.title,
      });
      dispatch(updateTask(task));
    });

    socket.on("task:updated", (task: Task) => {
      console.log("Received task:updated", {
        taskId: task._id,
        title: task.title,
      });
      dispatch(updateTask(task));
    });

    socket.on("task:assigned", (task: Task) => {
      console.log("Received task:assigned", {
        taskId: task._id,
        title: task.title,
        task,
      });
      dispatch(updateTask(task));
    });

    socket.on("user:blocked", (userId: string, isBlocked: boolean) => {
      console.log("Received user:blocked", {
        userId,
        isBlocked,
      });
      dispatch(blockUser(isBlocked));
    });
  }
  return socket;
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    console.log("Connecting Socket.IO");
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting Socket.IO", { socketId: socket.id });
    socket.off("task:created");
    socket.off("task:updated");
    socket.off("task:assigned");
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null => socket;
