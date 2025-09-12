import { z } from "zod/v4";

export const createBookingSchema = z.object({
  mentorId: z.string().uuid("Invalid mentor ID"),
  serviceId: z.string().uuid("Invalid service ID"),
  timeSlotId: z.string().uuid("Invalid time slot ID"),
  servicePrice: z.string().regex(/^\d+\.?\d{0,2}$/, "Invalid price format"),
  totalAmount: z
    .string()
    .regex(/^\d+\.?\d{0,2}$/, "Invalid total amount format"),
  platformFee: z
    .string()
    .regex(/^\d+\.?\d{0,2}$/, "Invalid platform fee format")
    .optional(),
  mentorEarnings: z
    .string()
    .regex(/^\d+\.?\d{0,2}$/, "Invalid mentor earnings format"),
  currency: z.string().length(3, "Currency must be 3 characters").optional(),
  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
  studentNotes: z
    .string()
    .max(500, "Student notes must be less than 500 characters")
    .optional(),
});

export const updateBookingStatusSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  status: z.enum(["pending", "confirmed", "cancelled", "completed", "no_show"]),
  mentorNotes: z
    .string()
    .max(1000, "Mentor notes must be less than 1000 characters")
    .optional(),
  meetingLink: z.string().url("Invalid meeting link").optional(),
});

export const bookingByIdSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
});

export const bookingsByDateRangeSchema = z.object({
  mentorId: z.string().uuid("Invalid mentor ID"),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
});

export const updatePaymentStatusSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  paymentStatus: z.enum(["pending", "paid", "refunded", "failed"]),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<
  typeof updateBookingStatusSchema
>;
export type BookingByIdInput = z.infer<typeof bookingByIdSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type BookingsByDateRangeInput = z.infer<
  typeof bookingsByDateRangeSchema
>;
export type UpdatePaymentStatusInput = z.infer<
  typeof updatePaymentStatusSchema
>;
