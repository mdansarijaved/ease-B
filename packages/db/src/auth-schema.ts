import { relations } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";

import { timestamps } from "./column.helper";
import { mentorTable } from "./mentor-schema";

export const user = pgTable(
  "user",
  (t) => ({
    id: t.text().primaryKey(),
    name: t.text().notNull(),
    email: t.text().notNull().unique(),
    emailVerified: t.boolean().notNull(),
    role: t
      .text({ enum: ["admin", "user", "mentor", "superadmin", "student"] })
      .default("user"),
    phone: t.text(),
    address: t.text(),
    city: t.text(),
    state: t.text(),
    zip: t.text(),
    country: t.text(),
    image: t.text(),
    ...timestamps,
  }),
  (t) => [index("email_index").on(t.email), index("role_index").on(t.role)],
);

export const session = pgTable("session", (t) => ({
  id: t.text().primaryKey(),
  expiresAt: t.timestamp().notNull(),
  token: t.text().notNull().unique(),
  ...timestamps,
  ipAddress: t.text(),
  userAgent: t.text(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}));

export const account = pgTable("account", (t) => ({
  id: t.text().primaryKey(),
  accountId: t.text().notNull(),
  providerId: t.text().notNull(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: t.text(),
  refreshToken: t.text(),
  idToken: t.text(),
  accessTokenExpiresAt: t.timestamp(),
  refreshTokenExpiresAt: t.timestamp(),
  scope: t.text(),
  password: t.text(),
  ...timestamps,
}));

export const verification = pgTable("verification", (t) => ({
  id: t.text().primaryKey(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.timestamp().notNull(),
  ...timestamps,
}));

export const userRelations = relations(user, ({ one }) => ({
  mentor: one(mentorTable),
}));
