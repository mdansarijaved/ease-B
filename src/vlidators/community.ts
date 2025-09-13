import { z } from "zod/v4";

export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(1, "Community name is required")
    .max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long"),
  image: z.url("Invalid image URL"),
  banner: z.url("Invalid banner URL").optional(),
  type: z.string().min(1, "Community type is required"),
});

export const updateCommunitySchema = z.object({
  id: z.uuid("Invalid community ID"),
  name: z
    .string()
    .min(1, "Community name is required")
    .max(100, "Name too long")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long")
    .optional(),
  image: z.url("Invalid image URL").optional(),
  banner: z.url("Invalid banner URL").optional(),
  type: z.string().min(1, "Community type is required").optional(),
  isActive: z.boolean().optional(),
});

export const deleteCommunitySchema = z.object({
  id: z.uuid("Invalid community ID"),
});

export const getCommunityByIdSchema = z.object({
  id: z.uuid("Invalid community ID"),
});

export const addMemberSchema = z.object({
  communityId: z.uuid("Invalid community ID"),
  userId: z.string().min(1, "User ID is required"),
});

export const removeMemberSchema = z.object({
  communityId: z.uuid("Invalid community ID"),
  userId: z.string().min(1, "User ID is required"),
});

export const getCommunityMembersSchema = z.object({
  communityId: z.uuid("Invalid community ID"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const getCommunityStatsSchema = z.object({
  communityId: z.uuid("Invalid community ID"),
});

export const getCommunityAnalyticsSchema = z.object({
  communityId: z.uuid("Invalid community ID"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const searchCommunitiesSchema = z.object({
  query: z.string().optional(),
  type: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const toggleCommunityStatusSchema = z.object({
  id: z.uuid("Invalid community ID"),
  isActive: z.boolean(),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;
export type GetCommunityMembersInput = z.infer<
  typeof getCommunityMembersSchema
>;
export type SearchCommunitiesInput = z.infer<typeof searchCommunitiesSchema>;
export type CommunityStatsInput = z.infer<typeof getCommunityStatsSchema>;
