import { HttpResponse } from "@/constants/response-message.constant";
import { z } from "zod";

export const createUserSchema = z
  .object({
    username: z
      .string()
      .min(1, HttpResponse.USERNAME_REQUIRED)
      .max(200, "Title must not exceed 200 characters"),
    email: z
      .string()
      .min(1, HttpResponse.EMAIL_REQUIRED)
      .max(5000, "Content must not exceed 5000 characters"),
    // thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
    // tags: z.array(z.string()).optional(),
  })
  .strict();

export type CreateUserRequestDTO = z.infer<typeof createUserSchema>;

export const blockUserSchema = z
  .object({
    isBlocked: z.boolean(),
  })
  .strict();

export type BlockUserRequestDTO = z.infer<typeof blockUserSchema>;
