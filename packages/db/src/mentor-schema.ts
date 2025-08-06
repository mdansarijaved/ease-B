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

export const mentor = pgTable("mentor", (t) => ({
  id: t.text().primaryKey(),
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
