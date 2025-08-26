import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { UserProfileRepository } from "../repository/user-profile.repository";
import { protectedProcedure } from "../trpc";
import { db } from "~/server/db/client";
import { userProfileFormSchema } from "~/vlidators";

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
