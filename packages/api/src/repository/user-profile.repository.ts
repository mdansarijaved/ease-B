import { eq } from "drizzle-orm";

import type { db as Database } from "@acme/db/client";

export class UserProfileRepository {
  private db: typeof Database;

  constructor(db: typeof Database) {
    this.db = db;
  }
}
