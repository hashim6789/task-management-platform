import axiosInstance from "@/lib/axios";
import { User } from "@/types";

// export async function login(email: string, password: string): Promise<User> {
// Mock authentication logic
// if (email === "admin@example.com" && password === "123456") {
//   return {
//     _id: "1",
//     email,
//     role: "admin",
//     isActive: true,
//     isBlocked: false,
//     createdAt: "2024-03-20T14:00:00.000Z",
//     updatedAt: "2024-04-03T09:00:00.000Z",
//     username: "user@123",
//   };
// } else if (email === "user@example.com" && password === "123456") {
//   return {
//     _id: "1",
//     email,
//     role: "user",
//     isActive: true,
//     isBlocked: false,
//     createdAt: "2024-03-20T14:00:00.000Z",
//     updatedAt: "2024-04-03T09:00:00.000Z",
//     username: "user@123",
//   };
// } else {
//   throw new Error("Invalid email or password");
// }
// }
export async function login(email: string, password: string): Promise<User> {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    console.log("response", response);
    console.log("user", response.data);
    return response.data; // The response is already the data due to the interceptor
  } catch (error) {
    throw new Error(
      "Login failed: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
