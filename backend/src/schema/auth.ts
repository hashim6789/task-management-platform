import { HttpResponse } from "@/constants/response-message.constant";
import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().email(HttpResponse.INVALID_EMAIL).optional(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .strict()
  .refine(
    (data) => data.email,
    //   || data.username
    {
      message: "Either email or username is required",
      path: ["email"],
    }
  );
