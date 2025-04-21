import { BlockUserRequestDTO, CreateUserRequestDTO } from "@/schema";

export interface UserQuery {
  page: string;
  limit: string;
  search: string;
  role: string;
  isBlocked: string;
  sortBy: string;
  sortOrder: "desc" | "asc";
}

export type CreateUserDTO = CreateUserRequestDTO & { password: string };
export type BlockUserDTO = BlockUserRequestDTO & { id: string };

export type Role = "admin" | "user";

export interface UserDTO {
  _id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
