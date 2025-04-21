export type Role = "admin" | "user";
export interface User {
  _id: string;
  username: string;
  email: string;
  role: Role;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}
