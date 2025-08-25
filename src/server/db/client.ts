import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export const db = drizzle({
  client: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  schema,
  logger: true,
  casing: "snake_case",
});

export type Database = typeof db;
