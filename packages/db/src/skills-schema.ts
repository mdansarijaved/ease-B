import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const skillTables = pgTable("skills", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  name: t.text("name").notNull(),
  description: t.text("description").notNull(),
  createdAt: t.timestamp("created_at").notNull().defaultNow(),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
}));

export const skillRelations = relations(skillTables, ({ many }) => ({
  skills: many(skillTables),
}));
