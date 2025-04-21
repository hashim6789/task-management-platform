import { Namespace, Socket } from "socket.io";
import { TaskPopulatedDTO } from "@/types/task";

// Mock function to get admin user IDs
const getAdminUserIds = async (): Promise<string[]> => {
  console.log("📥 Fetching admin user IDs");
  // Replace with actual logic to fetch admin user IDs from your DB
  return ["6803be0d5400a5d87060cc47"];
};

export const handleRealUpdated = (
  namespace: Namespace,
  socket: Socket
): void => {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    console.warn("⚠️ No user ID in socket data, disconnecting", {
      socketId: socket.id,
    });
    socket.disconnect();
    return;
  }

  const userRoom = `user:${userId}`;
  socket.join(userRoom);
  socket.data.connectedAt = Date.now();

  console.log("🏠 User joined room", { userId, userRoom, socketId: socket.id });

  socket.on("login", (_, callback) => {
    // Ignore login events since the user is already authenticated
    console.log("🔐 Login event ignored (already authenticated)");
    callback(true);
  });

  // Emit task events to relevant users (admins and assigned users)
  const emitToRelevantUsers = async (event: string, task: TaskPopulatedDTO) => {
    const adminUserIds = await getAdminUserIds();

    // Emit to all admin users
    adminUserIds.forEach((id) => {
      namespace.to(`user:${id}`).emit(event, task);
    });

    // Emit to the user the task is assigned to, if applicable
    if (task.assignedTo?._id) {
      namespace.to(`user:${task.assignedTo._id}`).emit(event, task);
    }
  };

  // Handle incoming task events and propagate them
  ["task:created", "task:updated", "task:assigned"].forEach((event) => {
    socket.on(
      event as keyof typeof socket.listeners,
      async (task: TaskPopulatedDTO) => {
        try {
          console.log(`📦 Received ${event}`, { taskId: task._id });

          if (!task._id) throw new Error("Invalid task data");

          // Emit the task event to relevant users
          await emitToRelevantUsers(event, task);
        } catch (err) {
          console.error(`❌ Error processing ${event}`, {
            err,
            taskId: task._id,
          });
          socket.emit("error", {
            message: `Failed to process ${event.replace("task:", "")}`,
          });
        }
      }
    );
  });
};
