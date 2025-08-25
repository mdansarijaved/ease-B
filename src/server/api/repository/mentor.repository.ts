import type { InferInsertModel, InferSelectModel } from "@acme/db";
import { db } from "@acme/db/client";
import { mentorTable } from "@acme/db/schema";

export type Mentor = InferSelectModel<typeof mentorTable>;
export type MentorInsert = InferInsertModel<typeof mentorTable>;
export interface WhereInput {
  id?: string;
  userId?: string;
}
export interface FindManyInput {
  limit?: number;
}

export class MentorRepository {
  async create(data: MentorInsert): Promise<Mentor> {
    const [row] = await db.insert(mentorTable).values(data).returning();
    if (!row) {
      throw new Error("Failed to create mentor");
    }
    return row;
  }
}
