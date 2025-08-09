import { eq } from "drizzle-orm";

import { db } from "@acme/db/client";
import { user as userTable } from "@acme/db/schema";

export const fetchUserRole = async (userId: string) => {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId));
  return user[0]?.role ?? "user";
};
