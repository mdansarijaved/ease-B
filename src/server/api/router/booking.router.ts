import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { BookingRepository } from "../repository/booking.repository";
import { MentorService } from "../services/mentor.service";
import { protectedProcedure } from "../trpc";
import { db } from "~/server/db/client";
import {
  bookingByIdSchema,
  bookingsByDateRangeSchema,
  cancelBookingSchema,
  createBookingSchema,
  updateBookingStatusSchema,
  updatePaymentStatusSchema,
} from "~/vlidators/booking";

const bookingRepo = new BookingRepository(db);
const mentorService = new MentorService(db);

export const bookingRouter = {
  create: protectedProcedure
    .input(createBookingSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const booking = await bookingRepo.createBooking({
          studentId: ctx.session.user.id,
          ...input,
        });
        return booking;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Failed to create booking",
        });
      }
    }),

  getById: protectedProcedure
    .input(bookingByIdSchema)
    .query(async ({ input, ctx }) => {
      const booking = await bookingRepo.getBookingById(input.bookingId);

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      const isStudent = booking.studentId === ctx.session.user.id;

      let isMentor = false;
      if (booking.mentor?.userProfile?.userId) {
        isMentor = booking.mentor.userProfile.userId === ctx.session.user.id;
      }

      if (!isStudent && !isMentor) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this booking",
        });
      }

      return booking;
    }),

  getMyBookings: protectedProcedure.query(async ({ ctx }) => {
    const bookings = await bookingRepo.getStudentBookings(ctx.session.user.id);
    return bookings;
  }),

  getMentorBookings: protectedProcedure.query(async ({ ctx }) => {
    const mentorRecord = await mentorService.getMentorProfile(
      ctx.session.user.id,
    );

    if (!mentorRecord) {
      return [];
    }

    const bookings = await bookingRepo.getMentorBookings(mentorRecord.id);
    return bookings;
  }),

  updateStatus: protectedProcedure
    .input(updateBookingStatusSchema)
    .mutation(async ({ input, ctx }) => {
      const booking = await bookingRepo.getBookingById(input.bookingId);

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      let isMentor = false;
      if (booking.mentor?.userProfile?.userId) {
        isMentor = booking.mentor.userProfile.userId === ctx.session.user.id;
      }

      if (!isMentor) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the mentor can update booking status",
        });
      }

      try {
        const updatedBooking = await bookingRepo.updateBookingStatus(input);
        return updatedBooking;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update booking status",
        });
      }
    }),

  cancel: protectedProcedure
    .input(cancelBookingSchema)
    .mutation(async ({ input, ctx }) => {
      const booking = await bookingRepo.getBookingById(input.bookingId);

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      const isStudent = booking.studentId === ctx.session.user.id;
      let isMentor = false;
      if (booking.mentor?.userProfile?.userId) {
        isMentor = booking.mentor.userProfile.userId === ctx.session.user.id;
      }

      if (!isStudent && !isMentor) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to cancel this booking",
        });
      }

      try {
        const cancelledBy = isStudent ? "student" : "mentor";
        const cancelledBooking = await bookingRepo.cancelBooking(
          input.bookingId,
          cancelledBy,
        );
        return cancelledBooking;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "Failed to cancel booking",
        });
      }
    }),

  getByDateRange: protectedProcedure
    .input(bookingsByDateRangeSchema)
    .query(async ({ input, ctx }) => {
      const mentorRecord = await db.query.mentorTable.findFirst({
        where: (mentorTable, { eq }) => eq(mentorTable.id, input.mentorId),
        with: {
          userProfile: true,
        },
      });

      if (
        !mentorRecord ||
        mentorRecord.userProfile?.userId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this mentor's bookings",
        });
      }

      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);

      const bookings = await bookingRepo.getBookingsByDateRange(
        input.mentorId,
        startDate,
        endDate,
      );

      return bookings;
    }),

  updatePaymentStatus: protectedProcedure
    .input(updatePaymentStatusSchema)
    .mutation(async ({ input, ctx }) => {
      const booking = await bookingRepo.getBookingById(input.bookingId);

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      let isMentor = false;
      if (booking.mentor?.userProfile?.userId) {
        isMentor = booking.mentor.userProfile.userId === ctx.session.user.id;
      }

      if (!isMentor) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the mentor can update payment status",
        });
      }

      try {
        const updatedBooking = await bookingRepo.updatePaymentStatus(
          input.bookingId,
          input.paymentStatus,
        );
        return updatedBooking;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update payment status",
        });
      }
    }),
} satisfies TRPCRouterRecord;
