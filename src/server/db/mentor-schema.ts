import { index, pgTable, primaryKey } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { timestamps } from "./column.helper";
import { skills, userProfileTable } from "./user-profile-scehma";
import { relations } from "drizzle-orm";

export const mentorTable = pgTable("mentor", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  userProfileId: t
    .uuid("user_profile_id")
    .references(() => userProfileTable.id, { onDelete: "cascade" })
    .unique(),
  yearsOfExperience: t.integer("years_of_experience").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
  isVerified: t.boolean("is_verified").notNull().default(false),
  rating: t.numeric("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalSessions: t.integer("total_sessions").notNull().default(0),
  introduction: t.text("introduction"),
  ...timestamps,
}));

export const mentorRelations = relations(mentorTable, ({ many }) => ({
  mentorService: many(mentorService),
  mentorAvailability: many(mentorAvailability),
  mentorTimeSlot: many(mentorTimeSlot),
  booking: many(booking),
  mentorPayout: many(mentorPayout),
}));

export const serviceCategory = pgTable("service_category", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  name: t.text("name").notNull().unique(),
  description: t.text("description"),
  isActive: t.boolean("is_active").notNull().default(true),
  ...timestamps,
}));

export const mentorService = pgTable("mentor_service", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  mentorId: t
    .uuid("mentor_id")
    .notNull()
    .references(() => mentorTable.id, { onDelete: "cascade" }),
  categoryId: t
    .uuid("category_id")
    .notNull()
    .references(() => serviceCategory.id, { onDelete: "cascade" }),
  title: t.text("title").notNull(),
  description: t.text("description").notNull(),
  duration: t.integer("duration").notNull(),
  price: t.numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: t.text("currency").notNull().default("USD"),
  pricingType: t
    .text({ enum: ["fixed", "hourly", "per_session"] })
    .notNull()
    .default("per_session"),
  isActive: t.boolean("is_active").notNull().default(true),
  maxParticipants: t.integer("max_participants").notNull().default(1),
  minBookingNotice: t.integer("min_booking_notice").notNull().default(24),
  maxBookingAdvance: t.integer("max_booking_advance").notNull().default(720),
  cancellationPolicy: t
    .text({ enum: ["flexible", "moderate", "strict"] })
    .notNull()
    .default("moderate"),
  ...timestamps,
}));

export const mentorServiceRelations = relations(mentorService, ({ many }) => ({
  mentorTimeSlot: many(mentorTimeSlot),
}));

export const mentorAvailability = pgTable(
  "mentor_availability",
  (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    mentorId: t
      .uuid("mentor_id")
      .notNull()
      .references(() => mentorTable.id, { onDelete: "cascade" }),
    dayOfWeek: t.integer("day_of_week").notNull(),
    startTime: t.time("start_time").notNull(),
    endTime: t.time("end_time").notNull(),
    isActive: t.boolean("is_active").notNull().default(true),
    timezone: t.text("timezone").notNull().default("UTC"),
    ...timestamps,
  }),
  (t) => [
    index("mentor_availability_mentor_day_index").on(t.mentorId, t.dayOfWeek),
  ],
);

export const mentorTimeSlot = pgTable(
  "mentor_time_slot",
  (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    mentorId: t
      .uuid("mentor_id")
      .notNull()
      .references(() => mentorTable.id, { onDelete: "cascade" }),
    serviceId: t
      .uuid("service_id")
      .notNull()
      .references(() => mentorService.id, { onDelete: "cascade" }),
    startDateTime: t.timestamp("start_date_time").notNull(),
    endDateTime: t.timestamp("end_date_time").notNull(),
    isBooked: t.boolean("is_booked").notNull().default(false),
    isActive: t.boolean("is_active").notNull().default(true),
    maxBookings: t.integer("max_bookings").notNull().default(1),
    currentBookings: t.integer("current_bookings").notNull().default(0),
    customPrice: t.numeric("custom_price", { precision: 10, scale: 2 }),
    ...timestamps,
  }),
  (t) => [
    index("mentor_timeslot_mentor_date_index").on(t.mentorId, t.startDateTime),
    index("mentor_timeslot_service_date_index").on(
      t.serviceId,
      t.startDateTime,
    ),
  ],
);

export const booking = pgTable(
  "booking",
  (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    studentId: t
      .text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    mentorId: t
      .uuid("mentor_id")
      .notNull()
      .references(() => mentorTable.id, { onDelete: "cascade" }),
    serviceId: t
      .uuid("service_id")
      .notNull()
      .references(() => mentorService.id, { onDelete: "cascade" }),
    timeSlotId: t
      .uuid("time_slot_id")
      .notNull()
      .references(() => mentorTimeSlot.id, { onDelete: "cascade" }),
    status: t
      .text({
        enum: ["pending", "confirmed", "cancelled", "completed", "no_show"],
      })
      .notNull()
      .default("pending"),
    servicePrice: t
      .numeric("service_price", { precision: 10, scale: 2 })
      .notNull(),
    totalAmount: t
      .numeric("total_amount", { precision: 10, scale: 2 })
      .notNull(),
    platformFee: t
      .numeric("platform_fee", { precision: 10, scale: 2 })
      .notNull()
      .default("0.00"),
    mentorEarnings: t
      .numeric("mentor_earnings", { precision: 10, scale: 2 })
      .notNull(),
    currency: t.text("currency").notNull().default("USD"),
    paymentStatus: t
      .text({ enum: ["pending", "paid", "refunded", "failed"] })
      .notNull()
      .default("pending"),
    meetingLink: t.text("meeting_link"),
    notes: t.text("notes"),
    studentNotes: t.text("student_notes"),
    mentorNotes: t.text("mentor_notes"),
    bookedAt: t.timestamp("booked_at").notNull().defaultNow(),
    ...timestamps,
  }),
  (t) => [
    index("booking_student_index").on(t.studentId),
    index("booking_mentor_index").on(t.mentorId),
    index("booking_status_index").on(t.status),
    index("booking_date_index").on(t.created_at),
  ],
);

export const mentorPayout = pgTable(
  "mentor_payout",
  (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    mentorId: t
      .uuid("mentor_id")
      .notNull()
      .references(() => mentorTable.id, { onDelete: "cascade" }),
    amount: t.numeric("amount", { precision: 10, scale: 2 }).notNull(),
    currency: t.text("currency").notNull().default("USD"),
    status: t
      .text({ enum: ["pending", "processing", "completed", "failed"] })
      .notNull()
      .default("pending"),
    payoutMethod: t
      .text({ enum: ["bank_transfer", "paypal", "stripe", "wallet"] })
      .notNull(),
    transactionId: t.text("transaction_id"),
    failureReason: t.text("failure_reason"),
    processedAt: t.timestamp("processed_at"),
    periodStart: t.date("period_start").notNull(),
    periodEnd: t.date("period_end").notNull(),
    ...timestamps,
  }),
  (t) => [
    index("mentor_payout_mentor_index").on(t.mentorId),
    index("mentor_payout_status_index").on(t.status),
    index("mentor_payout_period_index").on(t.periodStart, t.periodEnd),
  ],
);

export const mentorReview = pgTable(
  "mentor_review",
  (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    bookingId: t
      .uuid("booking_id")
      .references(() => booking.id, { onDelete: "cascade" })
      .unique()
      .notNull(),
    studentId: t
      .text("student_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    mentorId: t
      .uuid("mentor_id")
      .notNull()
      .references(() => mentorTable.id, { onDelete: "cascade" }),
    rating: t.integer("rating").notNull(),
    comment: t.text("comment"),
    isVisible: t.boolean("is_visible").notNull().default(true),
    ...timestamps,
  }),
  (t) => [
    index("mentor_review_mentor_index").on(t.mentorId),
    index("mentor_review_student_index").on(t.studentId),
  ],
);

export const mentorToSkills = pgTable(
  "mentor_to_skills",
  (t) => ({
    mentorId: t
      .uuid("mentor_id")
      .notNull()
      .references(() => mentorTable.id, { onDelete: "cascade" }),
    skillId: t
      .uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    proficiencyLevel: t
      .text({ enum: ["intermediate", "advanced", "expert"] })
      .notNull(),
    yearsOfExperience: t.integer("years_of_experience").notNull().default(0),
    ...timestamps,
  }),
  (t) => [primaryKey({ columns: [t.mentorId, t.skillId] })],
);
