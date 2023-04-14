import { z } from "zod";

export const HasID = z.object({ id: z.string() });
export const HasCreateUpdateTimestamps = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
