import { IUser } from "@/models";
import { CreateUserRequestDTO } from "@/schema/user";
import { BlockUserDTO, PaginatedData, UserQuery } from "@/types";

export interface IUserService {
  createUser(data: CreateUserRequestDTO): Promise<IUser>;
  findUsers(query: UserQuery): Promise<PaginatedData<IUser>>;
  blockUnblockUser(data: BlockUserDTO): Promise<IUser>;
}
