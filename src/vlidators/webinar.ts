import { z } from "zod/v4";

export const createWebinarSchema = z
  .object({
    title: z
      .string()
      .min(1, "Webinar title is required")
      .max(200, "Title too long"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(2000, "Description too long"),
    banner: z.url("Invalid banner URL"),
    startDate: z.date({
      error: "Start date is required",
    }),
    endDate: z.date({
      error: "End date is required",
    }),
    communityId: z.uuid("Invalid community ID").optional(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => data.startDate > new Date(), {
    message: "Start date must be in the future",
    path: ["startDate"],
  });

export const updateWebinarSchema = z
  .object({
    id: z.uuid("Invalid webinar ID"),
    title: z
      .string()
      .min(1, "Webinar title is required")
      .max(200, "Title too long")
      .optional(),
    description: z
      .string()
      .min(1, "Description is required")
      .max(2000, "Description too long")
      .optional(),
    banner: z.url("Invalid banner URL").optional(),
    startDate: z
      .date({
        error: "Invalid start date",
      })
      .optional(),
    endDate: z
      .date({
        error: "Invalid end date",
      })
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate < data.endDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export const deleteWebinarSchema = z.object({
  id: z.uuid("Invalid webinar ID"),
});

export const getWebinarByIdSchema = z.object({
  id: z.uuid("Invalid webinar ID"),
});

export const getWebinarsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  status: z.enum(["upcoming", "ongoing", "completed", "all"]).default("all"),
  search: z.string().optional(),
});

export const toggleWebinarStatusSchema = z.object({
  id: z.uuid("Invalid webinar ID"),
  isActive: z.boolean(),
});

export const getWebinarStatsSchema = z.object({
  id: z.uuid("Invalid webinar ID"),
});

export const getWebinarAnalyticsSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const registerAttendeeSchema = z.object({
  webinarId: z.uuid("Invalid webinar ID"),
  userId: z.string().min(1, "User ID is required"),
});

export const unregisterAttendeeSchema = z.object({
  webinarId: z.uuid("Invalid webinar ID"),
  userId: z.string().min(1, "User ID is required"),
});

export const getWebinarAttendeesSchema = z.object({
  webinarId: z.uuid("Invalid webinar ID"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const timeRangeSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CreateWebinarInput = z.infer<typeof createWebinarSchema>;
export type UpdateWebinarInput = z.infer<typeof updateWebinarSchema>;
export type GetWebinarsInput = z.infer<typeof getWebinarsSchema>;
export type WebinarStatsInput = z.infer<typeof getWebinarStatsSchema>;
export type GetWebinarAttendeesInput = z.infer<
  typeof getWebinarAttendeesSchema
>;
