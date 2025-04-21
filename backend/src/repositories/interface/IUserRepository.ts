import { IUser } from "@/models";
import { CreateUserDTO, PaginatedData, UserQuery } from "@/types";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findAllByQuery(query: UserQuery): Promise<PaginatedData<IUser>>;

  create(user: CreateUserDTO): Promise<IUser>;

  //   findByUsername(username: string): Promise<IUserModel | null>

  findOneWithUsernameOrEmail(value: string): Promise<IUser | null>;

  //   findByUsername(username: string): Promise<IUserModel | null>;

  findUserById(id: string): Promise<IUser | null>;

  updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>;
  //   updatePassword(email: string, hashedPassword: string): Promise<IUserModel | null>;

  //   updateUsername(id: string, username: string): Promise<IUserModel | null>;

  //   updateUserProfile(id: string, updateData: Partial<IUserModel>): Promise<IUserModel | null>;

  //   updateEmail(id: string, email: string): Promise<IUserModel | null>;

  //   updateProfilePicture(id: string, profilePicture: string): Promise<void>;
}
