import express, { Express, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

interface User {
  _id: string;
  username: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: User;
}

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React app URL (adjust for production)
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Mock task data (replace with actual database)
// let tasks: Task[] = [];

io.on("connection", (socket: Socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// API endpoints (replace with actual routes)
app.get("/tasks", (req: Request, res: Response) => {
  res.json({ data: tasks, total: tasks.length });
});

app.post("/tasks", (req: Request, res: Response) => {
  const task: Task = {
    _id: Math.random().toString(36).substr(2, 9),
    title: req.body.title,
    description: req.body.description,
    status: "todo",
    dueDate: req.body.dueDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: req.body.userId
      ? { _id: req.body.userId, username: "User" }
      : undefined,
  };
  tasks.push(task);
  io.emit("task:created", task); // Emit to all clients
  res.json({ data: task });
});

app.patch("/tasks/:id", (req: Request, res: Response) => {
  const task = tasks.find((t) => t._id === req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  task.status = req.body.status;
  task.updatedAt = new Date().toISOString();
  io.emit("task:updated", task); // Emit to all clients
  res.json({ data: task, message: "Task status updated" });
});

app.patch("/tasks/:id/assign", (req: Request, res: Response) => {
  const task = tasks.find((t) => t._id === req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  task.assignedTo = req.body.userId
    ? { _id: req.body.userId, username: "User" }
    : undefined;
  task.updatedAt = new Date().toISOString();
  io.emit("task:assigned", task); // Emit to all clients
  res.json({ data: task, message: "Task assigned" });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
