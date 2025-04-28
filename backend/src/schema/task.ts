// import { HttpResponse } from "@/constants/response-message.constant";
import { z } from "zod";

export const createTaskSchema = z
  .object({
    // title: z.string().min(3, "Title must be at least 3 characters"),
    // description: z
    //   .string()
    //   .min(10, "Description must be at least 10 characters"),
    // status: z.enum(["todo", "in-progress", "completed"]),
    // assignedTo: z.string().min(1, "Please select a user"),
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description cannot exceed 500 characters"),
    // dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    //   message: "Please select a valid date",
    // }),
    // dueDate: z.coerce.date({
    //   required_error: "Due Date is required",
    //   invalid_type_error: "Due Date must be a valid date",
    // }),
  })
  .strict();

export type CreateTaskRequestDTO = z.infer<typeof createTaskSchema>;

// export const blockUserSchema = z
//   .object({
//     isBlocked: z.boolean(),
//   })
//   .strict();

// export type BlockUserRequestDTO = z.infer<typeof blockUserSchema>;

export const assignTaskSchema = z
  .object({
    userId: z.string(),
  })
  .strict();

export type AssignTaskRequestDTO = z.infer<typeof assignTaskSchema>;

export const changeStatusTaskSchema = z
  .object({
    status: z.enum(["todo", "in-progress", "completed"]),
  })
  .strict();

export type ChangeStatusTaskRequestDTO = z.infer<typeof changeStatusTaskSchema>;
