import { IUser } from "@/models";

export interface IAuthService {
  login(
    identifier: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }>;

  refreshAccessToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }>;

  getUserById(userId: string): Promise<IUser>;
}
