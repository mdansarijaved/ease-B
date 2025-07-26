import { publicProcedure, router } from "@/lib/trpc";
import { z } from "zod";

export const usersRouter = router({
  getAll: publicProcedure.query(async () => {
    return { users: [] };
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return { user: { id: input.id, name: "John Doe" } };
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      // Create user logic
      return { user: { id: "1", ...input } };
    }),
});
