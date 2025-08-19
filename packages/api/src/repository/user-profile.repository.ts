import { eq } from "drizzle-orm";

import type { db as Database } from "@acme/db/client";
import { userProfileTable } from "@acme/db/schema";

export class UserProfileRepository {
  private db: typeof Database;

  constructor(db: typeof Database) {
    this.db = db;
  }

  async getUserPublicProfile(userID: string) {
    const userprofile = await this.db
      .select()
      .from(userProfileTable)
      .where(eq(userProfileTable.id, userID));

    return userprofile;
  }

  async createUserProfile(userID: string, data: UserProfile) {
    const userprofile = await this.db
      .insert(userProfileTable)
      .values({ userId: userID, ...data })
      .returning();

    return userprofile;
  }
}
