import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { timestamps } from "./column.helper";

export const userProfileTable = pgTable("user_profile", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t
    .text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),

  bio: t.text("bio"),
  ...timestamps,
}));

export const userProfileRelations = relations(userProfileTable, ({ many }) => ({
  userProfileToSkills: many(userProfileToSkills),
  userEducation: many(userEducation),
  userWorkHistory: many(userWorkHistory),
}));
export const skills = pgTable("skills", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  name: t.text("name").notNull().unique(),
  description: t.text("description"),
  ...timestamps,
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  userProfileToSkills: many(userProfileToSkills),
}));

export const userProfileToSkills = pgTable(
  "user_profile_to_skills",
  (t) => ({
    userProfileId: t
      .uuid("user_profile_id")
      .notNull()
      .references(() => userProfileTable.id, { onDelete: "cascade" }),
    skillId: t
      .uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    proficiencyLevel: t.text({
      enum: ["beginner", "intermediate", "advanced", "expert"],
    }),
    ...timestamps,
  }),
  (t) => [primaryKey({ columns: [t.userProfileId, t.skillId] })],
);

export const userProfileToSkillsRelation = relations(
  userProfileToSkills,
  ({ one }) => ({
    userProfile: one(userProfileTable, {
      fields: [userProfileToSkills.userProfileId],
      references: [userProfileTable.id],
    }),
    skill: one(skills, {
      fields: [userProfileToSkills.skillId],
      references: [skills.id],
    }),
  }),
);

export const userEducation = pgTable(
  "user_education",
  (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    userProfileId: t
      .uuid("user_profile_id")
      .references(() => userProfileTable.id, { onDelete: "cascade" }),
    institution: t.text("institution").notNull(),
    degree: t.text("degree").notNull(),
    startYear: t.integer("start_year").notNull(),
    endYear: t.integer("end_year"),
    active: t.boolean("active").notNull().default(false),
    description: t.text("description"),
    ...timestamps,
  }),
  (t) => [index("user_profile_education_index").on(t.userProfileId)],
);

export const userEducationRelation = relations(userEducation, ({ one }) => ({
  userProfile: one(userProfileTable, {
    fields: [userEducation.userProfileId],
    references: [userProfileTable.id],
  }),
}));

export const userWorkHistory = pgTable(
  "user_work_history",
  (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    userProfileId: t
      .uuid("user_profile_id")
      .references(() => userProfileTable.id, { onDelete: "cascade" }),
    company: t.text("company").notNull(),
    position: t.text("position").notNull(),
    startDate: t.date("start_date").notNull(),
    endDate: t.date("end_date"),
    current: t.boolean("current").notNull().default(false),
    description: t.text("description"),
    ...timestamps,
  }),
  (t) => [index("user_profile_work_index").on(t.userProfileId)],
);
export const userWorkHistoryRelation = relations(
  userWorkHistory,
  ({ one }) => ({
    userProfile: one(userProfileTable, {
      fields: [userWorkHistory.userProfileId],
      references: [userProfileTable.id],
    }),
  }),
);
