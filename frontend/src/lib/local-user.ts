import { User } from "@/types";

export const getUserProperty = (key: keyof User) => {
  const userData = localStorage.getItem("user");

  if (!userData) return null; // Return null if no data is found

  try {
    const parsedData: User = JSON.parse(userData);
    return parsedData[key] ?? null; // Return the specific key value or null
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};
