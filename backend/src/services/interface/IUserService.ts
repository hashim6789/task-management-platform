import { IUser } from "@/models";
import { CreateUserRequestDTO } from "@/schema/user";

export interface IUserService {
  createUser(data: CreateUserRequestDTO): Promise<IUser>;
}
