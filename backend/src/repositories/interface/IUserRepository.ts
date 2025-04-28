import { IUser } from "@/models";
import { PaginatedData, UserQuery } from "@/types";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findAllByQuery(query: UserQuery): Promise<PaginatedData<IUser>>;
}
