import type { InferInsertModel, InferSelectModel, SQL } from "@acme/db";
import type { appointmentStatusEnum, dayOfWeekEnum } from "@acme/db/schema";
import { and, eq, sql } from "@acme/db";
import { db } from "@acme/db/client";
import {
  eventTable,
  mentorAvailabilityTable,
  mentorTable,
  studentRegisteredEvents,
} from "@acme/db/schema";

import type { CrudAdapter } from "./base.repository";
import { BaseRepository } from "./base.repository";

export type Mentor = InferSelectModel<typeof mentorTable>;
export type MentorInsert = InferInsertModel<typeof mentorTable>;
export interface WhereInput {
  id?: string;
  userId?: string;
}
export interface FindManyInput {
  limit?: number;
}

const mentorAdapter: CrudAdapter<
  Mentor,
  MentorInsert,
  Partial<MentorInsert>,
  WhereInput,
  FindManyInput
> = {
  async findUnique({ where }) {
    const conditions: SQL[] = [];
    if (where.id) conditions.push(eq(mentorTable.id, where.id));
    if (where.userId) conditions.push(eq(mentorTable.userId, where.userId));
    if (conditions.length === 0) return null;
    const [first, ...rest] = conditions;
    const whereExpr = rest.length ? and(first, ...rest) : first;
    const rows = await db.select().from(mentorTable).where(whereExpr).limit(1);
    return rows[0] ?? null;
  },

  async findMany(params) {
    const q = db.select().from(mentorTable);
    if (params?.limit && params.limit > 0) {
      return q.limit(params.limit);
    }
    return q;
  },

  async create({ data }) {
    const [row] = await db.insert(mentorTable).values(data).returning();
    if (!row) throw new Error("Insert failed");
    return row;
  },

  async update({ where, data }) {
    if (!where.id) {
      throw new Error("update requires where.id");
    }
    const [row] = await db
      .update(mentorTable)
      .set(data)
      .where(eq(mentorTable.id, where.id))
      .returning();
    if (!row) throw new Error("Update affected 0 rows");
    return row;
  },

  async delete({ where }) {
    if (!where.id) {
      throw new Error("delete requires where.id");
    }
    const [row] = await db
      .delete(mentorTable)
      .where(eq(mentorTable.id, where.id))
      .returning();
    if (!row) throw new Error("Delete affected 0 rows");
    return row;
  },
};

export class MentorRepository extends BaseRepository<
  Mentor,
  MentorInsert,
  Partial<MentorInsert>,
  WhereInput,
  FindManyInput
> {
  constructor() {
    super(mentorAdapter);
  }

  findByUserId(userId: string): Promise<Mentor | null> {
    return this.findById({ userId });
  }

  async findMentorsWithSkills(skillIds: string[]): Promise<Mentor[]> {
    const rows = await db.select().from(mentorTable);
    return rows.filter(
      (m) =>
        Array.isArray(m.skills) && m.skills.some((s) => skillIds.includes(s)),
    );
  }

  async findMentorsWithAvailability(
    dayOfWeek: (typeof dayOfWeekEnum.enumValues)[number],
  ): Promise<Mentor[]> {
    const rows = await db
      .select({ mentor: mentorTable })
      .from(mentorTable)
      .innerJoin(
        mentorAvailabilityTable,
        eq(mentorAvailabilityTable.mentorId, mentorTable.id),
      )
      .where(eq(mentorAvailabilityTable.dayOfWeek, dayOfWeek));
    return rows.map((r) => r.mentor);
  }

  async getMentorStats(mentorId: string) {
    const [totalAppointmentsRow, completedAppointmentsRow, totalWebinarsRow] =
      await Promise.all([
        db
          .select({ count: sql<number>`count(*)` })
          .from(studentRegisteredEvents)
          .innerJoin(
            eventTable,
            eq(studentRegisteredEvents.eventId, eventTable.id),
          )
          .where(eq(eventTable.mentorId, mentorId)),
        db
          .select({ count: sql<number>`count(*)` })
          .from(studentRegisteredEvents)
          .innerJoin(
            eventTable,
            eq(studentRegisteredEvents.eventId, eventTable.id),
          )
          .where(
            and(
              eq(eventTable.mentorId, mentorId),
              eq(
                studentRegisteredEvents.status,
                ((): (typeof appointmentStatusEnum.enumValues)[number] =>
                  "COMPLETED")(),
              ),
            ),
          ),
        db
          .select({ count: sql<number>`count(*)` })
          .from(eventTable)
          .where(
            and(
              eq(eventTable.mentorId, mentorId),
              eq(eventTable.type, "WEBINAR"),
            ),
          ),
      ]);

    return {
      totalAppointments: totalAppointmentsRow[0]?.count ?? 0,
      completedAppointments: completedAppointmentsRow[0]?.count ?? 0,
      totalWebinars: totalWebinarsRow[0]?.count ?? 0,
    };
  }
}
