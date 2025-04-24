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
