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
  education: t.text(),
  certifications: t.text().array(),
  languages: t.text().array(),
  availability: t.text(),
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
