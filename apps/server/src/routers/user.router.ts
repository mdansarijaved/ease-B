import { publicProcedure, protectedProcedure, router } from "../lib/trpc";
import { z } from "zod";
import { UserService } from "../services/user.service";
import { TRPCError } from "@trpc/server";
import { container } from "../lib/container";

const userService = container.get<UserService>("userService");

export const usersRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      const users = await userService.getAll();
      return { users };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users",
      });
    }
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await userService.getById(input.id);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
        return { user };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user",
        });
      }
    }),

  updateRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["USER", "MENTOR", "ADMIN"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await userService.updateUserRole(input.userId, input.role);
        return { user };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user role",
        });
      }
    }),

  getMentors: publicProcedure.query(async () => {
    try {
      const mentors = await userService.getMentors();
      return { mentors };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch mentors",
      });
    }
  }),

  getUserRole: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const role = await userService.getUserRole(input.userId);
        return { role };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user role",
        });
      }
    }),
});
