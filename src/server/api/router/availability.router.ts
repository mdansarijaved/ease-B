import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { AvailabilityRepository } from "../repository/availability.repository";
import { MentorService } from "../services/mentor.service";
import { protectedProcedure } from "../trpc";
import { db } from "~/server/db/client";
import { mentorTable, userProfileTable } from "~/server/db/schema";
import {
  createAvailabilitySchema,
  updateAvailabilitySchema,
  deleteAvailabilitySchema,
  getAvailabilityByDaySchema,
  toggleAvailabilityDaySchema,
  saveWeeklyAvailabilitySchema,
  dayNameToNumber,
  dayNumberToName,
} from "~/vlidators/availability";

const availabilityRepo = new AvailabilityRepository(db);
const mentorService = new MentorService(db);

export const availabilityRouter = {
  getMyAvailability: protectedProcedure.query(async ({ ctx }) => {
    const mentorRecord = await mentorService.getMentorProfile(
      ctx.session.user.id,
    );

    if (!mentorRecord) {
      return [];
    }

    const availability = await availabilityRepo.getMentorAvailability(
      mentorRecord.id,
    );

    const weeklyAvailability: Record<string, { start: string; end: string }[]> =
      {};

    availability.forEach((slot) => {
      const dayName = dayNumberToName(slot.dayOfWeek);

      weeklyAvailability[dayName] ??= [];
      weeklyAvailability[dayName].push({
        start: slot.startTime,
        end: slot.endTime,
      });
    });

    return weeklyAvailability;
  }),

  saveWeeklyAvailability: protectedProcedure
    .input(saveWeeklyAvailabilitySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const hadMentorProfile = await mentorService.hasMentorProfile(
          ctx.session.user.id,
        );

        console.log(
          "Had mentor profile:",
          hadMentorProfile,
          "for user:",
          ctx.session.user.id,
        );

        let mentorRecord = await mentorService.getMentorProfile(
          ctx.session.user.id,
        );

        if (!mentorRecord) {
          console.log("No mentor profile found, creating one...");

          let userProfile = await db.query.userProfileTable.findFirst({
            where: (userProfileTable, { eq }) =>
              eq(userProfileTable.userId, ctx.session.user.id),
          });

          if (!userProfile) {
            const [newUserProfile] = await db
              .insert(userProfileTable)
              .values({
                userId: ctx.session.user.id,
                bio: "New mentor profile",
              })
              .returning();

            if (!newUserProfile) {
              throw new Error("Failed to create user profile");
            }
            userProfile = newUserProfile;
          }

          const [newMentorRecord] = await db
            .insert(mentorTable)
            .values({
              userProfileId: userProfile.id,
              yearsOfExperience: 0,
              isActive: true,
              isVerified: false,
              rating: "0.00",
              totalSessions: 0,
              introduction:
                "Welcome! I'm excited to help you on your learning journey.",
            })
            .returning();

          if (!newMentorRecord) {
            throw new Error("Failed to create mentor profile");
          }

          mentorRecord = await db.query.mentorTable.findFirst({
            where: (mentorTable, { eq }) =>
              eq(mentorTable.id, newMentorRecord.id),
            with: {
              userProfile: true,
            },
          });

          if (!mentorRecord) {
            throw new Error("Failed to fetch created mentor profile");
          }
        }

        console.log("Mentor record ID:", mentorRecord?.id);

        const availabilitySlots: Array<{
          dayOfWeek: number;
          startTime: string;
          endTime: string;
          timezone?: string;
        }> = [];

        Object.entries(input.availability).forEach(([dayName, intervals]) => {
          if (intervals && intervals.length > 0) {
            const dayOfWeek = dayNameToNumber(dayName);
            if (dayOfWeek >= 0) {
              intervals.forEach((interval) => {
                availabilitySlots.push({
                  dayOfWeek,
                  startTime: interval.start,
                  endTime: interval.end,
                  timezone: input.timezone,
                });
              });
            }
          }
        });
        const savedAvailability = await availabilityRepo.replaceAllAvailability(
          mentorRecord.id,
          availabilitySlots,
        );

        return {
          success: true,
          message: hadMentorProfile
            ? "Availability saved successfully"
            : "Mentor profile created and availability saved successfully",
          count: savedAvailability.length,
          mentorCreated: !hadMentorProfile,
        };
      } catch (error) {
        console.error("Error in saveWeeklyAvailability:", error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to save availability",
        });
      }
    }),

  create: protectedProcedure
    .input(createAvailabilitySchema)
    .mutation(async ({ input, ctx }) => {
      const mentorRecord = await mentorService.getOrCreateMentorProfile(
        ctx.session.user.id,
      );

      try {
        const availability = await availabilityRepo.createAvailability({
          mentorId: mentorRecord.id,
          ...input,
        });
        return availability;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create availability",
        });
      }
    }),

  update: protectedProcedure
    .input(updateAvailabilitySchema)
    .mutation(async ({ input, ctx }) => {
      const availability = await db.query.mentorAvailability.findFirst({
        where: (mentorAvailability, { eq }) => {
          return eq(mentorAvailability.id, input.id);
        },
        with: {
          mentor: {
            with: {
              userProfile: true,
            },
          },
        },
      });

      if (
        !availability ||
        availability.mentor.userProfile?.userId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Availability slot not found or access denied",
        });
      }

      try {
        const updatedAvailability =
          await availabilityRepo.updateAvailability(input);
        return updatedAvailability;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update availability",
        });
      }
    }),

  delete: protectedProcedure
    .input(deleteAvailabilitySchema)
    .mutation(async ({ input, ctx }) => {
      const availability = await db.query.mentorAvailability.findFirst({
        where: (mentorAvailability, { eq }) => {
          return eq(mentorAvailability.id, input.id);
        },
        with: {
          mentor: {
            with: {
              userProfile: true,
            },
          },
        },
      });

      if (
        !availability ||
        availability.mentor.userProfile?.userId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Availability slot not found or access denied",
        });
      }

      try {
        await availabilityRepo.deleteAvailability(input.id);
        return { success: true, message: "Availability slot deleted" };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete availability",
        });
      }
    }),

  getByDay: protectedProcedure
    .input(getAvailabilityByDaySchema)
    .query(async ({ input, ctx }) => {
      const mentorRecord = await mentorService.getMentorProfile(
        ctx.session.user.id,
      );

      if (!mentorRecord) {
        return [];
      }

      const availability = await availabilityRepo.getAvailabilityByDay(
        mentorRecord.id,
        input.dayOfWeek,
      );

      return availability;
    }),

  toggleDay: protectedProcedure
    .input(toggleAvailabilityDaySchema)
    .mutation(async ({ input, ctx }) => {
      const mentorRecord = await mentorService.getOrCreateMentorProfile(
        ctx.session.user.id,
      );

      try {
        await availabilityRepo.toggleAvailabilityDay(
          mentorRecord.id,
          input.dayOfWeek,
          input.isActive,
        );

        return {
          success: true,
          message: `${dayNumberToName(input.dayOfWeek)} availability ${
            input.isActive ? "enabled" : "disabled"
          }`,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to toggle day availability",
        });
      }
    }),
} satisfies TRPCRouterRecord;
