import { User } from "@/types";

export async function login(email: string, password: string): Promise<User> {
  // Mock authentication logic
  if (email === "admin@example.com" && password === "123456") {
    return {
      _id: "1",
      email,
      role: "admin",
      isActive: true,
      isBlocked: false,
      createdAt: "2024-03-20T14:00:00.000Z",
      updatedAt: "2024-04-03T09:00:00.000Z",
      username: "user@123",
    };
  } else if (email === "user@example.com" && password === "123456") {
    return {
      _id: "1",
      email,
      role: "user",
      isActive: true,
      isBlocked: false,
      createdAt: "2024-03-20T14:00:00.000Z",
      updatedAt: "2024-04-03T09:00:00.000Z",
      username: "user@123",
    };
  } else {
    throw new Error("Invalid email or password");
  }
}
