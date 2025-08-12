import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { timestamps } from "./column.helper";

export const dayOfWeekEnum = pgEnum("day_of_week", [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
]);

export const webinarStatusEnum = pgEnum("webinar_status", [
  "SCHEDULED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
]);

export const mentorTable = pgTable("mentor", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t.text().references(() => user.id),
  about: t.text(),
  skills: t.text().array(),
  experience: t.text(),
  education: t
    .jsonb()
    .$type<
      {
        degree: string;
        institution: string;
        year: number;
        active: boolean;
      }[]
    >()
    .notNull(),
  certifications: t.text().array(),
  languages: t.text().array(),
  ...timestamps,
}));

export const mentorAvailabilityTable = pgTable("mentor_availability", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  mentorId: t.uuid("mentor_id").references(() => mentorTable.id),
  dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
  timeslots: t
    .jsonb()
    .$type<
      {
        startTime: string;
        endTime: string;
      }[]
    >()
    .notNull(),
  ...timestamps,
}));

export const webinarTable = pgTable("webinar", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  mentorId: t.uuid("mentor_id").references(() => mentorTable.id),
  title: t.text("title").notNull(),
  description: t.text("description").notNull(),
  date: t.date("date").notNull(),
  ...timestamps,
}));

export const userMentorRelation = relations(mentorTable, ({ one }) => {
  return {
    user: one(user, {
      fields: [mentorTable.id],
      references: [user.id],
    }),
  };
});
