import { Task } from ".";

export interface ServerToClientEvents {
  "task:created": (task: Task) => void;
  "task:updated": (task: Task) => void;
  "task:assigned": (task: Task) => void;
  connect: () => void;
  connect_error: (error: Error) => void;
  disconnect: () => void;
}

export interface ClientToServerEvents {
  login: (
    userId: string,
    callback: (success: boolean, message?: string) => void
  ) => void;
  "task:created": (task: Task) => void;
  "task:updated": (task: Task) => void;
  "task:assigned": (task: Task) => void;
}
