import { relations } from "drizzle-orm";
import { uuid } from "drizzle-orm/gel-core";
import { integer, pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { timestamps } from "./column.helper";
import { skillTables } from "./skills-schema";
import { studentRegisteredEvents } from "./student-schema";

export const dayOfWeekEnum = pgEnum("day_of_week", [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
]);

export const eventTypeEnum = pgEnum("event_type", ["WEBINAR", "ONE_ON_ONE"]);

export const eventStatusEnum = pgEnum("event_status", [
  "SCHEDULED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
]);

export const mentorTable = pgTable("mentor", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t.text("user_id").references(() => user.id, { onDelete: "cascade" }),
  about: t.text(),
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

export const mentorToSkills = pgTable(
  "mentor_to_skills",
  (t) => ({
    mentorId: t
      .uuid("mentor_id")
      .notNull()
      .references(() => mentorTable.id),
    skillId: t
      .uuid("skill_id")
      .notNull()
      .references(() => skillTables.id),
  }),
  (t) => [primaryKey({ columns: [t.mentorId, t.skillId] })],
);
export const mentorAvailabilityTable = pgTable("mentor_availability", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  mentorId: t
    .uuid("mentor_id")
    .references(() => mentorTable.id, { onDelete: "cascade" }),
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

export const eventTable = pgTable("event", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  mentorId: t
    .uuid("mentor_id")
    .references(() => mentorTable.id, { onDelete: "cascade" }),
  type: eventTypeEnum("type").notNull(),
  title: t.text("title").notNull(),
  description: t.text("description").notNull(),
  date: t.date("date").notNull(),
  status: eventStatusEnum("status").notNull(),
  ...timestamps,
}));

export const userMentorRelation = relations(mentorTable, ({ one, many }) => {
  return {
    user: one(user, {
      fields: [mentorTable.userId],
      references: [user.id],
    }),
    events: many(eventTable),
    availability: one(mentorAvailabilityTable),
  };
});

export const mentorAvailabilityRelation = relations(
  mentorAvailabilityTable,
  ({ one }) => ({
    mentor: one(mentorTable, {
      fields: [mentorAvailabilityTable.mentorId],
      references: [mentorTable.id],
    }),
  }),
);

export const eventRelation = relations(eventTable, ({ one, many }) => ({
  mentor: one(mentorTable, {
    fields: [eventTable.mentorId],
    references: [mentorTable.id],
  }),
  students: many(studentRegisteredEvents),
}));
