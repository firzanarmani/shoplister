import { z } from "zod";

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  details: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  listId: z.string().optional(),

  userId: z.string().optional(),
});

export type Item = z.infer<typeof ItemSchema>;

export const CreateItemSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email cannot be empty" })
    .email("Invalid email address"),
  body: z.object({
    listId: z.string(),
    name: z.string(),
    details: z.string().optional(),
  }),
});

export type CreateItemBody = z.infer<typeof CreateItemSchema>["body"];

export const UpdateItemSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email cannot be empty" })
    .email("Invalid email address"),
  params: z.object({
    id: z
      .string({ required_error: "Item ID is required" })
      .min(1, { message: "Item ID cannot be empty" }),
  }),
  body: z.object({
    listId: z.string(),
    name: z.string().optional(),
    details: z.string().optional(),
  }),
});

export type UpdateItemParams = z.infer<typeof UpdateItemSchema>["params"];
export type UpdateItemBody = z.infer<typeof UpdateItemSchema>["body"];

export const DeleteItemSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email cannot be empty" })
    .email("Invalid email address"),
  params: z.object({
    id: z
      .string({ required_error: "Item ID is required" })
      .min(1, { message: "Item ID cannot be empty" }),
  }),
  body: z.object({
    listId: z.string(),
  }),
});

export type DeleteItemParams = z.infer<typeof DeleteItemSchema>["params"];
export type DeleteItemBody = z.infer<typeof DeleteItemSchema>["body"];
