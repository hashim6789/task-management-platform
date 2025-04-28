import { IUserRepository } from "@/repositories/interface";
import { IAuthService } from "../interface";
import { IUser } from "@/models";
import {
  comparePassword,
  createHttpError,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utils";
import { HttpResponse, HttpStatus } from "@/constants";
import { JwtPayload } from "jsonwebtoken";

//!   Implementation for Auth Service
export class AuthService implements IAuthService {
  constructor(private readonly _userRepository: IUserRepository) {}

  async login(
    identifier: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const user = await this._userRepository.findByEmail(identifier);

    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    if (user.isBlocked) {
      throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED);
    }

    const isMatch = await comparePassword(password, user.password);
    console.log(user, password, isMatch);

    if (!isMatch) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.PASSWORD_INCORRECT
      );
    }

    const payload = { id: user._id, role: user.role, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, user };
  }

  async refreshAccessToken(token: string) {
    if (!token) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.NO_TOKEN);
    }

    const decoded = verifyRefreshToken(token) as JwtPayload;
    if (!decoded) {
      throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.TOKEN_EXPIRED);
    }

    const payload = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_BLOCKED);
    }

    return user;
  }
}
