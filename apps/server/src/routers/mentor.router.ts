import { publicProcedure, protectedProcedure, router } from "../lib/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { container } from "../lib/container";
import type { MentorService } from "../services/mentor.service";
import { DayOfWeek } from "prisma/generated/enums";

const mentorService = container.get<MentorService>("mentorService");

export const mentorRouter = router({
  search: publicProcedure
    .input(
      z.object({
        skills: z.array(z.string()).optional(),
        services: z.array(z.string()).optional(),
        dayOfWeek: z.enum(DayOfWeek).optional(),
        priceRange: z
          .object({
            min: z.number(),
            max: z.number(),
          })
          .optional(),
        timezone: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const mentors = await mentorService.searchMentors(input);
        return { mentors };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search mentors",
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const mentor = await mentorService.getById(input.id);
        if (!mentor) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Mentor not found",
          });
        }
        return { mentor };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch mentor",
        });
      }
    }),

  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const mentor = await mentorService.getMentorByUserId(input.userId);
        return { mentor };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch mentor profile",
        });
      }
    }),

  createProfile: protectedProcedure
    .input(
      z.object({
        about: z
          .string()
          .min(10, "About section must be at least 10 characters"),
        languages: z
          .array(z.string())
          .min(1, "At least one language is required"),
        timezone: z.string(),
        skills: z.array(z.string()).min(1, "At least one skill is required"),
        services: z
          .array(
            z.object({
              serviceId: z.string(),
              price: z.number().min(0, "Price must be non-negative"),
              duration: z
                .number()
                .min(15, "Duration must be at least 15 minutes"),
              currency: z.string().default("USD"),
            })
          )
          .min(1, "At least one service is required"),
        availability: z
          .array(
            z.object({
              dayOfWeek: z.enum(DayOfWeek),
              startTime: z.string(),
              endTime: z.string(),
            })
          )
          .min(1, "At least one availability slot is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const mentor = await mentorService.createMentorProfile({
          ...input,
          userId: ctx.session.user.id,
        });
        return { mentor };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create mentor profile",
        });
      }
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        mentorId: z.string(),
        about: z
          .string()
          .min(10, "About section must be at least 10 characters")
          .optional(),
        languages: z.array(z.string()).optional(),
        timezone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { mentorId, ...updateData } = input;
        const mentor = await mentorService.updateMentorProfile(
          mentorId,
          updateData
        );
        return { mentor };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update mentor profile",
        });
      }
    }),

  addSkill: protectedProcedure
    .input(
      z.object({
        mentorId: z.string(),
        skillId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await mentorService.addMentorSkill(input.mentorId, input.skillId);
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add skill",
        });
      }
    }),

  removeSkill: protectedProcedure
    .input(
      z.object({
        mentorId: z.string(),
        skillId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await mentorService.removeMentorSkill(input.mentorId, input.skillId);
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove skill",
        });
      }
    }),

  addService: protectedProcedure
    .input(
      z.object({
        mentorId: z.string(),
        serviceId: z.string(),
        price: z.number().min(0, "Price must be non-negative"),
        duration: z.number().min(15, "Duration must be at least 15 minutes"),
        currency: z.string().default("USD"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { mentorId, ...serviceData } = input;
        await mentorService.addMentorService(mentorId, serviceData);
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add service",
        });
      }
    }),

  updateService: protectedProcedure
    .input(
      z.object({
        mentorServiceId: z.string(),
        price: z.number().min(0, "Price must be non-negative").optional(),
        duration: z
          .number()
          .min(15, "Duration must be at least 15 minutes")
          .optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { mentorServiceId, ...updateData } = input;
        await mentorService.updateMentorService(mentorServiceId, updateData);
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update service",
        });
      }
    }),

  updateAvailability: protectedProcedure
    .input(
      z.object({
        mentorId: z.string(),
        availability: z.array(
          z.object({
            dayOfWeek: z.enum(DayOfWeek),
            startTime: z.string(),
            endTime: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await mentorService.updateMentorAvailability(
          input.mentorId,
          input.availability
        );
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update availability",
        });
      }
    }),

  getStats: protectedProcedure
    .input(z.object({ mentorId: z.string() }))
    .query(async ({ input }) => {
      try {
        const stats = await mentorService.getMentorStats(input.mentorId);
        return { stats };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch mentor stats",
        });
      }
    }),

  getRating: publicProcedure
    .input(z.object({ mentorId: z.string() }))
    .query(async ({ input }) => {
      try {
        const rating = await mentorService.getMentorRating(input.mentorId);
        return { rating };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch mentor rating",
        });
      }
    }),
});
