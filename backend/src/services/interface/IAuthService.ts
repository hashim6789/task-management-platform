import { IUser } from "@/models";

export interface IAuthService {
  login(
    identifier: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }>;

  // googleAuth(token: string): Promise<{ user: IUserModel; accessToken: string; refreshToken: string }>;

  // verifyOtp(otp: string, email: string): Promise<{ user: IUserModel, accessToken: string, refreshToken: string }>;

  // verifyForgotPassword(email: string): Promise<{ status: number; message: string }>;

  // getResetPassword(token: string, password: string): Promise<{ status: number; message: string }>;

  refreshAccessToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }>;

  getUserById(userId: string): Promise<IUser>;
}
