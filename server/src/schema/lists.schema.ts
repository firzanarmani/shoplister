import { z } from "zod";

export const ItemSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(1, "Name cannot be empty"),
});

export const ListSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(1, "Name cannot be empty"),
  items: z.array(ItemSchema),
});

export type Item = z.infer<typeof ItemSchema>;
export type List = z.infer<typeof ListSchema>;
