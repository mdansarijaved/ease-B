import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { timestamps } from "./column.helper";
import { eventTable } from "./mentor-schema";

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
]);

export const studentTable = pgTable("student", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t.text("user_id").references(() => user.id, { onDelete: "cascade" }),
  skills: t.text().array(),
  experience: t.text(),
  education: t.jsonb("education").$type<
    {
      school: string;
      degree: string;
      fieldOfStudy: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
    }[]
  >(),
  certifications: t.text().array(),
  languages: t.text().array(),
  ...timestamps,
}));

export const studentRegisteredEvents = pgTable(
  "student_registered_events",
  (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    studentId: t
      .uuid("student_id")
      .references(() => studentTable.id, { onDelete: "cascade" }),
    eventId: t.uuid("event_id").references(() => eventTable.id),
    status: appointmentStatusEnum("status").notNull().default("PENDING"),
    ...timestamps,
  }),
);

export const studentRegisteredEventsRelation = relations(
  studentRegisteredEvents,
  ({ one }) => ({
    student: one(studentTable, {
      fields: [studentRegisteredEvents.studentId],
      references: [studentTable.id],
    }),
    event: one(eventTable, {
      fields: [studentRegisteredEvents.eventId],
      references: [eventTable.id],
    }),
  }),
);
