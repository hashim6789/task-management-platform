import { IUserRepository } from "@/repositories/interface";
import { IUserService } from "../interface";
import { IUser } from "@/models";
import {
  checkEmailExistence,
  createHttpError,
  generateRandomPassword,
  hashPassword,
} from "@/utils";
import { HttpResponse, HttpStatus } from "@/constants";
import { CreateUserRequestDTO } from "@/schema/user";
import { BlockUserDTO, PaginatedData, UserQuery } from "@/types";
import { sendCredentialsEmail } from "@/utils/send-email.util";

export class UserService implements IUserService {
  constructor(private readonly _userRepository: IUserRepository) {}

  async createUser(data: CreateUserRequestDTO): Promise<IUser> {
    console.log(data);
    const isEmailValid = await checkEmailExistence(data.email);
    if (!isEmailValid) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_EMAIL);
    }
    const user = await this._userRepository.findByEmail(data.email);
    const generatedPassword = generateRandomPassword(6);
    const hashedPassword = await hashPassword(generatedPassword);
    console.log("user", user);
    if (user) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.USERNAME_EXIST
      );
    }

    await sendCredentialsEmail(data.email, data.username, generatedPassword);
    return this._userRepository.create({ ...data, password: hashedPassword });
  }
  async blockUnblockUser(data: BlockUserDTO): Promise<IUser> {
    let user = await this._userRepository.findUserById(data.id);
    if (!user || user.role === "admin") {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.USER_NOT_FOUND
      );
    }

    if (user.isBlocked !== data.isBlocked) {
      user = await this._userRepository.updateUser(data.id, {
        isBlocked: data.isBlocked,
      });
      if (!user) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          HttpResponse.USER_NOT_FOUND
        );
      }
    }

    return user;
  }

  async findUsers(query: UserQuery): Promise<PaginatedData<IUser>> {
    return this._userRepository.findAllByQuery(query);
  }
}
