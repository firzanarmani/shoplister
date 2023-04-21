import { z } from "zod";

import { ItemSchema } from "@/schema/lists.schema";

export const ListSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  items: z.array(ItemSchema),

  userId: z.string(),
});

export type List = z.infer<typeof ListSchema>;

export const GetListsSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email cannot be empty" })
    .email("Invalid email address"),
});

export type GetLists = z.infer<typeof GetListsSchema>;

export const GetListSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email cannot be empty" })
    .email("Invalid email address"),
  params: z.object({
    id: z
      .string({ required_error: "List ID is required" })
      .min(1, { message: "List ID cannot be empty" }),
  }),
});

export type GetListParams = z.infer<typeof GetListSchema>["params"];

export const CreateListSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email cannot be empty" })
    .email("Invalid email address"),
  body: z.object({
    name: z
      .string({ required_error: "List name is required" })
      .min(1, { message: "List name cannot be empty" }),
  }),
});

export type CreateListBody = z.infer<typeof CreateListSchema>["body"];

export const UpdateListSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email cannot be empty" })
    .email("Invalid email address"),
  params: z.object({
    id: z
      .string({ required_error: "List ID is required" })
      .min(1, { message: "List ID cannot be empty" }),
  }),
  body: z.object({
    name: z.string().optional(),
    userEmails: z.array(z.object({ email: z.string() })).optional(),
  }),
});

export type UpdateListParams = z.infer<typeof UpdateListSchema>["params"];
export type UpdateListBody = z.infer<typeof UpdateListSchema>["body"];

export const DeleteListSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email cannot be empty" })
    .email("Invalid email address"),
  params: z.object({
    id: z
      .string({ required_error: "List ID is required" })
      .min(1, { message: "List ID cannot be empty" }),
  }),
});

export type DeleteListParams = z.infer<typeof DeleteListSchema>["params"];
