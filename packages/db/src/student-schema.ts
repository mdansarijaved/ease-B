import { pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { timestamps } from "./column.helper";

export const studentTable = pgTable("student", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),

  userId: t.uuid("user_id").references(() => user.id),
  ...timestamps,
}));
