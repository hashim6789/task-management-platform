import { IUserRepository } from "@/repositories/interface";
import { IUserService } from "../interface";
import { IUser } from "@/models";
import { createHttpError } from "@/utils";
import { HttpResponse, HttpStatus } from "@/constants";
import { CreateUserRequestDTO } from "@/schema/user";

export class UserService implements IUserService {
  constructor(private readonly _userRepository: IUserRepository) {}

  async createUser(data: CreateUserRequestDTO): Promise<IUser> {
    const user = await this._userRepository.findByEmail(data.email);
    if (user) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.USERNAME_EXIST
      );
    }
    return this._userRepository.create(data);
  }
}
