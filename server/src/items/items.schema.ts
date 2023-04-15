import { z } from "zod";

export const ListSchema = z.object({
  id: z.string(),
  name: z.string(),
  details: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  listId: z.string().optional(),

  userId: z.string().optional(),
});

export type List = z.infer<typeof ListSchema>;
