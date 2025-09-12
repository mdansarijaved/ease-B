import { and, desc, eq, gte, lte } from "drizzle-orm";
import type { db as Database } from "~/server/db/client";
import { booking, mentorTimeSlot } from "~/server/db/schema";

export interface CreateBookingInput {
  studentId: string;
  mentorId: string;
  serviceId: string;
  timeSlotId: string;
  servicePrice: string;
  totalAmount: string;
  platformFee?: string;
  mentorEarnings: string;
  currency?: string;
  notes?: string;
  studentNotes?: string;
}

export interface UpdateBookingStatusInput {
  bookingId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  mentorNotes?: string;
  meetingLink?: string;
}

export class BookingRepository {
  private db: typeof Database;

  constructor(db: typeof Database) {
    this.db = db;
  }

  async createBooking(data: CreateBookingInput) {
    return await this.db.transaction(async (tx) => {
      const timeSlot = await tx
        .select()
        .from(mentorTimeSlot)
        .where(
          and(
            eq(mentorTimeSlot.id, data.timeSlotId),
            eq(mentorTimeSlot.isActive, true),
            eq(mentorTimeSlot.isBooked, false),
          ),
        );

      if (!timeSlot || timeSlot.length === 0) {
        tx.rollback();
        throw new Error("Time slot is not available");
      }

      const slot = timeSlot[0]!;

      if (slot.currentBookings >= slot.maxBookings) {
        tx.rollback();
        throw new Error("Time slot is fully booked");
      }

      const [newBooking] = await tx
        .insert(booking)
        .values({
          studentId: data.studentId,
          mentorId: data.mentorId,
          serviceId: data.serviceId,
          timeSlotId: data.timeSlotId,
          servicePrice: data.servicePrice,
          totalAmount: data.totalAmount,
          platformFee: data.platformFee ?? "0.00",
          mentorEarnings: data.mentorEarnings,
          currency: data.currency ?? "USD",
          notes: data.notes,
          studentNotes: data.studentNotes,
          status: "pending",
          paymentStatus: "pending",
        })
        .returning();

      if (!newBooking) {
        tx.rollback();
        throw new Error("Failed to create booking");
      }

      await tx
        .update(mentorTimeSlot)
        .set({
          currentBookings: slot.currentBookings + 1,
          isBooked: slot.currentBookings + 1 >= slot.maxBookings,
        })
        .where(eq(mentorTimeSlot.id, data.timeSlotId));

      return newBooking;
    });
  }

  async getBookingById(bookingId: string) {
    const bookingData = await this.db.query.booking.findFirst({
      where: eq(booking.id, bookingId),
      with: {
        student: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        mentor: {
          with: {
            userProfile: {
              columns: {
                userId: true,
              },
            },
          },
        },
        service: {
          columns: {
            title: true,
            description: true,
            duration: true,
            price: true,
            currency: true,
          },
        },
        timeSlot: {
          columns: {
            startDateTime: true,
            endDateTime: true,
          },
        },
        review: true,
      },
    });

    return bookingData;
  }

  async getStudentBookings(studentId: string) {
    const bookings = await this.db.query.booking.findMany({
      where: eq(booking.studentId, studentId),
      orderBy: [desc(booking.created_at)],
      with: {
        mentor: {
          with: {
            userProfile: {
              columns: {
                userId: true,
              },
            },
          },
        },
        service: {
          columns: {
            title: true,
            duration: true,
            price: true,
            currency: true,
          },
        },
        timeSlot: {
          columns: {
            startDateTime: true,
            endDateTime: true,
          },
        },
      },
    });

    return bookings;
  }

  async getMentorBookings(mentorId: string) {
    const bookings = await this.db.query.booking.findMany({
      where: eq(booking.mentorId, mentorId),
      orderBy: [desc(booking.created_at)],
      with: {
        student: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        service: {
          columns: {
            title: true,
            duration: true,
            price: true,
            currency: true,
          },
        },
        timeSlot: {
          columns: {
            startDateTime: true,
            endDateTime: true,
          },
        },
        review: true,
      },
    });

    return bookings;
  }

  async updateBookingStatus(data: UpdateBookingStatusInput) {
    const [updatedBooking] = await this.db
      .update(booking)
      .set({
        status: data.status,
        mentorNotes: data.mentorNotes,
        meetingLink: data.meetingLink,
        updated_at: new Date(),
      })
      .where(eq(booking.id, data.bookingId))
      .returning();

    if (!updatedBooking) {
      throw new Error("Booking not found");
    }

    return updatedBooking;
  }

  async cancelBooking(bookingId: string, _cancelledBy: "student" | "mentor") {
    return await this.db.transaction(async (tx) => {
      const bookingData = await tx
        .select({
          timeSlotId: booking.timeSlotId,
          status: booking.status,
        })
        .from(booking)
        .where(eq(booking.id, bookingId));

      if (!bookingData || bookingData.length === 0) {
        tx.rollback();
        throw new Error("Booking not found");
      }

      const bookingInfo = bookingData[0]!;

      if (
        bookingInfo.status === "cancelled" ||
        bookingInfo.status === "completed"
      ) {
        tx.rollback();
        throw new Error("Cannot cancel this booking");
      }

      const [updatedBooking] = await tx
        .update(booking)
        .set({
          status: "cancelled",
          updated_at: new Date(),
        })
        .where(eq(booking.id, bookingId))
        .returning();

      const timeSlot = await tx
        .select()
        .from(mentorTimeSlot)
        .where(eq(mentorTimeSlot.id, bookingInfo.timeSlotId));

      if (timeSlot && timeSlot.length > 0) {
        const slot = timeSlot[0]!;
        await tx
          .update(mentorTimeSlot)
          .set({
            currentBookings: Math.max(0, slot.currentBookings - 1),
            isBooked: false,
          })
          .where(eq(mentorTimeSlot.id, bookingInfo.timeSlotId));
      }

      return updatedBooking;
    });
  }

  async getBookingsByDateRange(
    mentorId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const bookings = await this.db.query.booking.findMany({
      where: and(
        eq(booking.mentorId, mentorId),
        gte(booking.created_at, startDate),
        lte(booking.created_at, endDate),
      ),
      with: {
        student: {
          columns: {
            name: true,
            email: true,
          },
        },
        service: {
          columns: {
            title: true,
            duration: true,
          },
        },
        timeSlot: {
          columns: {
            startDateTime: true,
            endDateTime: true,
          },
        },
      },
      orderBy: [desc(booking.created_at)],
    });

    return bookings;
  }

  async updatePaymentStatus(
    bookingId: string,
    paymentStatus: "pending" | "paid" | "refunded" | "failed",
  ) {
    const [updatedBooking] = await this.db
      .update(booking)
      .set({
        paymentStatus,
        updated_at: new Date(),
      })
      .where(eq(booking.id, bookingId))
      .returning();

    if (!updatedBooking) {
      throw new Error("Booking not found");
    }

    return updatedBooking;
  }
}
