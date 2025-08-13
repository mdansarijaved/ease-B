import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { dayOfWeekEnum } from "@acme/db/schema";

import { MentorRepository } from "../repository/mentor.repository";
import { protectedProcedure, publicProcedure } from "../trpc";

const repo = new MentorRepository();

export const mentorRouter = {
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input }) => repo.findById({ id: input.id })),

  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => repo.findByUserId(input.userId)),

  list: publicProcedure
    .input(
      z
        .object({ limit: z.number().int().positive().max(100).optional() })
        .optional(),
    )
    .query(({ input }) => repo.findMany({ limit: input?.limit })),

  withSkills: publicProcedure
    .input(z.object({ skillIds: z.array(z.string()).min(1) }))
    .query(({ input }) => repo.findMentorsWithSkills(input.skillIds)),

  withAvailability: publicProcedure
    .input(z.object({ dayOfWeek: z.enum(dayOfWeekEnum.enumValues) }))
    .query(({ input }) => repo.findMentorsWithAvailability(input.dayOfWeek)),

  stats: publicProcedure
    .input(z.object({ mentorId: z.string().uuid() }))
    .query(({ input }) => repo.getMentorStats(input.mentorId)),
} satisfies TRPCRouterRecord;
