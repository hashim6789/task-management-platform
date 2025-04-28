import { IUser } from "@/models";
import { CreateUserDTO, PaginatedData, UserQuery } from "@/types";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findAllByQuery(query: UserQuery): Promise<PaginatedData<IUser>>;
  // findOneWithUsernameOrEmail(value: string): Promise<IUser | null>;
  // findUserById(id: string): Promise<IUser | null>;

  // create(user: CreateUserDTO): Promise<IUser>;

  //   findByUsername(username: string): Promise<IUserModel | null>

  //   findByUsername(username: string): Promise<IUserModel | null>;

  // updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>;
}
