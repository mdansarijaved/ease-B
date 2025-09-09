import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { UserProfileRepository } from "../repository/user-profile.repository";
import { protectedProcedure } from "../trpc";
import { db } from "~/server/db/client";
import { userProfileFormSchema } from "~/vlidators";
import { userProfileTable } from "~/server/db/user-profile-scehma";
import { eq } from "drizzle-orm";

// const userprofileRepo = new UserProfileRepository(db);

export const userprofileRouter = {
  get: protectedProcedure.input(z.object()).query(async ({ input, ctx }) => {
    // const userProfile = await userprofileRepo.getUserPublicProfile(
    //   ctx.session.user.id,
    // );

    // if (!userProfile) {
    //   return null;
    // }

    // return userProfile;
    const userprofile = await db
      .select()
      .from(userProfileTable)
      .where(eq(userProfileTable.userId, ctx.session.user.id));

    return userprofile[0];
  }),
  // create: protectedProcedure
  //   .input(userProfileFormSchema)
  //   .mutation(async ({ input, ctx }) => {
  //     const userProfile = await userprofileRepo.createUserProfile(
  //       ctx.session.user.id,
  //       input,
  //     );
  //     return userProfile;
  //   }),
} satisfies TRPCRouterRecord;
