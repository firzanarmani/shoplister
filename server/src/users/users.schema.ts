import { z } from "zod";

export const GetUserSchema = z.object({
  params: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .min(1, { message: "Email cannot be empty" })
      .email("Invalid email address"),
  }),
});

export type GetUserParams = z.infer<typeof GetUserSchema>["params"];
