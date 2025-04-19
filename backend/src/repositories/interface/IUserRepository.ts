import { IUser } from "@/models";
import { CreateUserRequestDTO } from "@/schema/user";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(user: CreateUserRequestDTO): Promise<IUser>;

  //   findByUsername(username: string): Promise<IUserModel | null>

  findOneWithUsernameOrEmail(value: string): Promise<IUser | null>;

  //   findByUsername(username: string): Promise<IUserModel | null>;

  //   findUserById(id: string): Promise<IUserModel | null>;

  //   updatePassword(email: string, hashedPassword: string): Promise<IUserModel | null>;

  //   updateUsername(id: string, username: string): Promise<IUserModel | null>;

  //   updateUserProfile(id: string, updateData: Partial<IUserModel>): Promise<IUserModel | null>;

  //   updateEmail(id: string, email: string): Promise<IUserModel | null>;

  //   updateProfilePicture(id: string, profilePicture: string): Promise<void>;
}
