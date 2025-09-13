import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { WebinarRepository } from "../repository/webinar.repository";
import { protectedProcedure } from "../trpc";
import { db } from "~/server/db/client";
import {
  createWebinarSchema,
  updateWebinarSchema,
  deleteWebinarSchema,
  getWebinarByIdSchema,
  getWebinarsSchema,
  toggleWebinarStatusSchema,
  getWebinarAnalyticsSchema,
} from "~/vlidators";

const webinarRepo = new WebinarRepository(db);

export const webinarRouter = {
  create: protectedProcedure
    .input(createWebinarSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const webinar = await webinarRepo.createWebinar({
          ...input,
          ownerId: ctx.session.user.id,
        });

        return {
          success: true,
          message: "Webinar created successfully",
          webinar,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Failed to create webinar",
        });
      }
    }),

  getById: protectedProcedure
    .input(getWebinarByIdSchema)
    .query(async ({ input }) => {
      try {
        const webinar = await webinarRepo.getWebinarById(input.id);

        if (!webinar) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Webinar not found",
          });
        }

        return webinar;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Failed to fetch webinar",
        });
      }
    }),

  getMyWebinars: protectedProcedure
    .input(getWebinarsSchema)
    .query(async ({ input, ctx }) => {
      try {
        const result = await webinarRepo.getUserWebinars(
          ctx.session.user.id,
          input.page,
          input.limit,
          input.status,
          input.search,
        );

        return result;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Failed to fetch webinars",
        });
      }
    }),

  update: protectedProcedure
    .input(updateWebinarSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, ...updateData } = input;
        const webinar = await webinarRepo.updateWebinar(
          id,
          ctx.session.user.id,
          updateData,
        );

        return {
          success: true,
          message: "Webinar updated successfully",
          webinar,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Failed to update webinar",
        });
      }
    }),

  delete: protectedProcedure
    .input(deleteWebinarSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await webinarRepo.deleteWebinar(input.id, ctx.session.user.id);

        return {
          success: true,
          message: "Webinar deleted successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Failed to delete webinar",
        });
      }
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stats = await webinarRepo.getWebinarStats(ctx.session.user.id);

      return stats;
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch webinar stats",
      });
    }
  }),

  getAnalytics: protectedProcedure
    .input(getWebinarAnalyticsSchema)
    .query(async ({ input, ctx }) => {
      try {
        const analytics = await webinarRepo.getWebinarAnalytics(
          ctx.session.user.id,
          input.startDate,
          input.endDate,
        );

        return analytics;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch webinar analytics",
        });
      }
    }),

  toggleStatus: protectedProcedure
    .input(toggleWebinarStatusSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const webinar = await webinarRepo.toggleWebinarStatus(
          input.id,
          ctx.session.user.id,
          input.isActive,
        );

        return {
          success: true,
          message: `Webinar ${input.isActive ? "activated" : "deactivated"} successfully`,
          webinar,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update webinar status",
        });
      }
    }),

  getUpcoming: protectedProcedure.query(async ({ ctx }) => {
    try {
      const webinars = await webinarRepo.getUpcomingWebinars(
        ctx.session.user.id,
        5,
      );

      return webinars;
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch upcoming webinars",
      });
    }
  }),

  search: protectedProcedure
    .input(getWebinarsSchema.pick({ page: true, limit: true, search: true }))
    .query(async ({ input }) => {
      try {
        const result = await webinarRepo.searchWebinars(
          input.search,
          input.page,
          input.limit,
        );

        return result;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to search webinars",
        });
      }
    }),
} satisfies TRPCRouterRecord;
