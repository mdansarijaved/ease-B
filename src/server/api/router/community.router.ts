import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { CommunityRepository } from "../repository/community.repository";
import { protectedProcedure } from "../trpc";
import { db } from "~/server/db/client";
import {
  createCommunitySchema,
  updateCommunitySchema,
  deleteCommunitySchema,
  getCommunityByIdSchema,
  addMemberSchema,
  removeMemberSchema,
  getCommunityMembersSchema,
  getCommunityStatsSchema,
  searchCommunitiesSchema,
  toggleCommunityStatusSchema,
} from "~/vlidators";

const communityRepo = new CommunityRepository(db);

export const communityRouter = {
  create: protectedProcedure
    .input(createCommunitySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const community = await communityRepo.createCommunity({
          ...input,
          ownerId: ctx.session.user.id,
        });

        return {
          success: true,
          message: "Community created successfully",
          community,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create community",
        });
      }
    }),

  getById: protectedProcedure
    .input(getCommunityByIdSchema)
    .query(async ({ input }) => {
      try {
        const community = await communityRepo.getCommunityById(input.id);

        if (!community) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Community not found",
          });
        }

        return community;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch community",
        });
      }
    }),

  getMyCommunities: protectedProcedure.query(async ({ ctx }) => {
    try {
      const communities = await communityRepo.getUserCommunities(
        ctx.session.user.id,
      );

      return communities;
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch communities",
      });
    }
  }),

  update: protectedProcedure
    .input(updateCommunitySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, ...updateData } = input;
        const community = await communityRepo.updateCommunity(
          id,
          ctx.session.user.id,
          updateData,
        );

        return {
          success: true,
          message: "Community updated successfully",
          community,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update community",
        });
      }
    }),

  delete: protectedProcedure
    .input(deleteCommunitySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await communityRepo.deleteCommunity(input.id, ctx.session.user.id);

        return {
          success: true,
          message: "Community deleted successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete community",
        });
      }
    }),

  addMember: protectedProcedure
    .input(addMemberSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const community = await communityRepo.getCommunityById(
          input.communityId,
        );

        if (!community) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Community not found",
          });
        }

        if (community.owner.id !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to add members to this community",
          });
        }

        const member = await communityRepo.addMember(
          input.communityId,
          input.userId,
        );

        return {
          success: true,
          message: "Member added successfully",
          member,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Failed to add member",
        });
      }
    }),

  removeMember: protectedProcedure
    .input(removeMemberSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await communityRepo.removeMember(
          input.communityId,
          input.userId,
          ctx.session.user.id,
        );

        return {
          success: true,
          message: "Member removed successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Failed to remove member",
        });
      }
    }),

  getMembers: protectedProcedure
    .input(getCommunityMembersSchema)
    .query(async ({ input, ctx }) => {
      try {
        const community = await communityRepo.getCommunityById(
          input.communityId,
        );

        if (!community) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Community not found",
          });
        }

        if (community.owner.id !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to view members of this community",
          });
        }

        const members = await communityRepo.getCommunityMembers(
          input.communityId,
          input.page,
          input.limit,
        );

        return members;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Failed to fetch members",
        });
      }
    }),

  getStats: protectedProcedure
    .input(getCommunityStatsSchema)
    .query(async ({ input, ctx }) => {
      try {
        const community = await communityRepo.getCommunityById(
          input.communityId,
        );

        if (!community) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Community not found",
          });
        }

        if (community.owner.id !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to view stats for this community",
          });
        }

        const stats = await communityRepo.getCommunityStats(input.communityId);

        return stats;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch community stats",
        });
      }
    }),

  search: protectedProcedure
    .input(searchCommunitiesSchema)
    .query(async ({ input }) => {
      try {
        const result = await communityRepo.searchCommunities(
          input.query,
          input.type,
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
              : "Failed to search communities",
        });
      }
    }),

  toggleStatus: protectedProcedure
    .input(toggleCommunityStatusSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const community = await communityRepo.toggleCommunityStatus(
          input.id,
          ctx.session.user.id,
          input.isActive,
        );

        return {
          success: true,
          message: `Community ${input.isActive ? "activated" : "deactivated"} successfully`,
          community,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update community status",
        });
      }
    }),
} satisfies TRPCRouterRecord;
