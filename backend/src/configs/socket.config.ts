import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { env } from "./env.config";
import { handleRealUpdated } from "@/utils";
import { TaskPopulatedDTO } from "@/types/task";

// Socket.IO event types
interface ServerToClientEvents {
  "task:created": (task: TaskPopulatedDTO) => void;
  "task:updated": (task: TaskPopulatedDTO) => void;
  "task:assigned": (task: TaskPopulatedDTO) => void;
  error: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  "task:created": (task: TaskPopulatedDTO) => void;
  "task:updated": (task: TaskPopulatedDTO) => void;
  "task:assigned": (task: TaskPopulatedDTO) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId: string;
}

let io:
  | Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >
  | undefined;

export const connectSocket = (server: HttpServer): typeof io => {
  if (io) {
    console.warn("⚠️ Socket.IO already initialized. Reinitializing...");
    io.close();
  }

  io = new Server(server, {
    cors: {
      origin: env.CLIENT_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Set up the namespace for real-time communication
  const namespace = io.of("/real");

  namespace.on("connection", (socket: Socket) => {
    console.log("🔌 Client connected to /real namespace:", socket.id);

    // Call the handler for task-related events
    handleRealUpdated(namespace, socket);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  // Ping events every 60 seconds to ensure server-client connection remains alive
  io.on("ping", () => console.log("📡 Inter-server ping received"));
  setInterval(() => {
    io?.serverSideEmit("ping");
    console.log("⏱️ Inter-server ping emitted");
  }, 60000);

  return io;
};

export const getIo = (): typeof io => {
  if (!io) throw new Error("❗ Socket.IO not initialized!");
  return io;
};
