import UserModel from "@/models/user.model";
import { UserRepository } from "@/repositories/implementation/user.repository";

const userRepository = new UserRepository(UserModel);

export const generateUniqueUsername = async (name: string) => {
  const baseUsername = name.trim().toLocaleLowerCase().replace(/\s+/g, "_");
  let username = baseUsername;

  while (await userRepository.findByUsername(username)) {
    const counter = Math.floor(100 + Math.random() * 900);
    username = `${baseUsername}${counter}`;
  }

  return username;
};

export const generateRandomPassword = (
  length: number = 10,
  includeSymbols: boolean = true
): string => {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const allChars = letters + numbers + (includeSymbols ? symbols : "");

  let password = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * allChars.length);
    password += allChars[index];
  }

  return password;
};
