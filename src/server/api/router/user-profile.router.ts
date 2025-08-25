import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { db } from "@acme/db/client";
import { userProfileFormSchema } from "@acme/validators";

import { UserProfileRepository } from "../repository/user-profile.repository";
import { protectedProcedure } from "../trpc";

const userprofileRepo = new UserProfileRepository(db);

export const userprofileRouter = {
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const userProfile = await userprofileRepo.getUserPublicProfile(input.id);

      return userProfile;
    }),
  create: protectedProcedure
    .input(userProfileFormSchema)
    .mutation(async ({ input, ctx }) => {
      const userProfile = await userprofileRepo.createUserProfile(
        ctx.session.user.id,
        input,
      );
      return userProfile;
    }),
} satisfies TRPCRouterRecord;
