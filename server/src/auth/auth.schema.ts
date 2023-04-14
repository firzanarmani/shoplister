import { z } from "zod";

export const RegisterSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .min(1, { message: "Email cannot be empty" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, { message: "Password cannot be empty" })
      .min(8, "At least 8 characters long"),
    //   .regex(
    //     ALLOWED_CHARS_PATTERN,
    //     "Only letters, numbers or any of ! @ # $ % ^ & *"
    //   )
    //   .regex(LOWERCASE_PATTERN, "At least 1 lowercase character")
    //   .regex(UPPERCASE_PATTERN, "At least 1 uppercase character"),
    name: z
      .string({ required_error: "is required" })
      .min(1, { message: "Name cannot be empty" }),
  }),
});

export type Register = z.infer<typeof RegisterSchema>["body"];

export const LoginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .min(1, { message: "Email cannot be empty" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, { message: "Password cannot be empty" })
      .min(8, "At least 8 characters long"),
  }),
});

export type Login = z.infer<typeof LoginSchema>["body"];
