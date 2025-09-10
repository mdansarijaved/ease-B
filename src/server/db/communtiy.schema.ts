import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";

export const communityTable = pgTable("community_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  banner: text("banner"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  type: text("type").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const communityRelations = relations(
  communityTable,
  ({ one, many }) => ({
    owner: one(user, {
      fields: [communityTable.ownerId],
      references: [user.id],
      relationName: "communities_owner",
    }),
    members: many(userToCommunitesMapping),
  }),
);

export const userToCommunitesMapping = pgTable("user_to_community_mapping", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  communityId: uuid("community_id")
    .notNull()
    .references(() => communityTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userToCommunitesMappingRelations = relations(
  userToCommunitesMapping,
  ({ one }) => ({
    user: one(user, {
      fields: [userToCommunitesMapping.userId],
      references: [user.id],
    }),
    community: one(communityTable, {
      fields: [userToCommunitesMapping.communityId],
      references: [communityTable.id],
    }),
  }),
);
