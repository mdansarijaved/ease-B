import { eq } from "drizzle-orm";
import { user as UserTable } from "~/server/db/auth-schema";
import { db } from "~/server/db/client";

export const fetchUserRole = async (userId: string) => {
  const user = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, userId));

  return user[0]?.isAdmin ? "admin" : "user";
};
