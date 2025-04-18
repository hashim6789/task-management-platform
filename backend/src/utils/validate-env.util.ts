import { env } from "@/configs/env.config";

export function validateEnv() {
  if (!env.PORT) {
    throw new Error("PORT is not found in the env");
  }
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is not found in the env");
  }
  // if (!env.REDIS_URL) {
  //   throw new Error("REDIS_URL is not found in the env");
  // }
  if (!env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not found in the env");
  }
  if (!env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not found in the env");
  }
  if (!env.SENDER_EMAIL) {
    throw new Error("SENDER_EMAIL is not found in the env");
  }
  if (!env.PASSKEY) {
    throw new Error("PASSKEY is not found in the env");
  }
  if (!env.CLIENT_ORIGIN) {
    throw new Error("CLIENT_ORIGIN is not found in the env");
  }
  // if (!env.RESET_PASS_URL) {
  //   throw new Error("RESET_PASS_URL is not found in the env");
  // }
  // if (!env.CLOUDINARY_CLOUD_NAME) {
  //   throw new Error("CLOUDINARY_CLOUD_NAME is not found in the env");
  // }
  // if (!env.CLOUDINARY_API_KEY) {
  //   throw new Error("CLOUDINARY_API_KEY is not found in the env");
  // }
  // if (!env.CLOUDINARY_API_SECRET) {
  //   throw new Error("CLOUDINARY_API_SECRET is not found in the env");
  // }
  if (!env.NODE_ENV) {
    throw new Error("NODE_ENV is not found in the env");
  }
}
