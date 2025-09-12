import { z } from "zod/v4";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const timeSchema = z
  .string()
  .min(1, "Time is required")
  .refine(
    (val) => {
      const cleanValue = val.trim();

      return timeRegex.test(cleanValue);
    },
    {
      message: "Time must be in HH:MM format (e.g., 09:00, 14:30)",
    },
  )
  .transform((val) => val.trim());

const dayOfWeekSchema = z.number().int().min(0).max(6);

export const createAvailabilitySchema = z
  .object({
    dayOfWeek: dayOfWeekSchema,
    startTime: timeSchema,
    endTime: timeSchema,
    timezone: z.string().optional(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const updateAvailabilitySchema = z
  .object({
    id: z.string().uuid("Invalid availability ID"),
    dayOfWeek: dayOfWeekSchema.optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    isActive: z.boolean().optional(),
    timezone: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export const deleteAvailabilitySchema = z.object({
  id: z.string().uuid("Invalid availability ID"),
});

export const getAvailabilityByDaySchema = z.object({
  dayOfWeek: dayOfWeekSchema,
});

export const toggleAvailabilityDaySchema = z.object({
  dayOfWeek: dayOfWeekSchema,
  isActive: z.boolean(),
});

export const replaceAllAvailabilitySchema = z.object({
  availability: z.array(createAvailabilitySchema),
});

export const weeklyAvailabilitySchema = z.object({
  Monday: z
    .array(
      z.object({
        start: timeSchema,
        end: timeSchema,
      }),
    )
    .optional(),
  Tuesday: z
    .array(
      z.object({
        start: timeSchema,
        end: timeSchema,
      }),
    )
    .optional(),
  Wednesday: z
    .array(
      z.object({
        start: timeSchema,
        end: timeSchema,
      }),
    )
    .optional(),
  Thursday: z
    .array(
      z.object({
        start: timeSchema,
        end: timeSchema,
      }),
    )
    .optional(),
  Friday: z
    .array(
      z.object({
        start: timeSchema,
        end: timeSchema,
      }),
    )
    .optional(),
  Saturday: z
    .array(
      z.object({
        start: timeSchema,
        end: timeSchema,
      }),
    )
    .optional(),
  Sunday: z
    .array(
      z.object({
        start: timeSchema,
        end: timeSchema,
      }),
    )
    .optional(),
});

export const saveWeeklyAvailabilitySchema = z.object({
  availability: weeklyAvailabilitySchema,
  timezone: z.string().optional(),
});

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
export type DeleteAvailabilityInput = z.infer<typeof deleteAvailabilitySchema>;
export type GetAvailabilityByDayInput = z.infer<
  typeof getAvailabilityByDaySchema
>;
export type ToggleAvailabilityDayInput = z.infer<
  typeof toggleAvailabilityDaySchema
>;
export type ReplaceAllAvailabilityInput = z.infer<
  typeof replaceAllAvailabilitySchema
>;
export type WeeklyAvailabilityInput = z.infer<typeof weeklyAvailabilitySchema>;
export type SaveWeeklyAvailabilityInput = z.infer<
  typeof saveWeeklyAvailabilitySchema
>;

export const dayNameToNumber = (dayName: string): number => {
  const dayMap: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return dayMap[dayName] ?? -1;
};

export const dayNumberToName = (dayNumber: number): string => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[dayNumber] ?? "Unknown";
};
