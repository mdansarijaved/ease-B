import { and, eq } from "drizzle-orm";
import type { db as Database } from "~/server/db/client";
import { mentorAvailability } from "~/server/db/schema";

export interface CreateAvailabilityInput {
  mentorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone?: string;
}

export interface UpdateAvailabilityInput {
  id: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
  timezone?: string;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  timezone: string;
  created_at: Date;
  updated_at: Date | null;
}

export class AvailabilityRepository {
  private db: typeof Database;

  constructor(db: typeof Database) {
    this.db = db;
  }

  async createAvailability(
    data: CreateAvailabilityInput,
  ): Promise<AvailabilitySlot> {
    const [newAvailability] = await this.db
      .insert(mentorAvailability)
      .values({
        mentorId: data.mentorId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        timezone: data.timezone ?? "UTC",
        isActive: true,
      })
      .returning();

    if (!newAvailability) {
      throw new Error("Failed to create availability");
    }

    return newAvailability;
  }

  async getMentorAvailability(mentorId: string): Promise<AvailabilitySlot[]> {
    const availability = await this.db
      .select()
      .from(mentorAvailability)
      .where(
        and(
          eq(mentorAvailability.mentorId, mentorId),
          eq(mentorAvailability.isActive, true),
        ),
      )
      .orderBy(mentorAvailability.dayOfWeek, mentorAvailability.startTime);

    return availability;
  }

  async updateAvailability(
    data: UpdateAvailabilityInput,
  ): Promise<AvailabilitySlot> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date(),
    };

    if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.timezone !== undefined) updateData.timezone = data.timezone;

    const [updatedAvailability] = await this.db
      .update(mentorAvailability)
      .set(updateData)
      .where(eq(mentorAvailability.id, data.id))
      .returning();

    if (!updatedAvailability) {
      throw new Error("Availability slot not found");
    }

    return updatedAvailability;
  }

  async deleteAvailability(id: string): Promise<void> {
    const result = await this.db
      .delete(mentorAvailability)
      .where(eq(mentorAvailability.id, id))
      .returning();

    if (!result || result.length === 0) {
      throw new Error("Availability slot not found");
    }
  }

  async replaceAllAvailability(
    mentorId: string,
    availabilitySlots: Omit<CreateAvailabilityInput, "mentorId">[],
  ): Promise<AvailabilitySlot[]> {
    return await this.db.transaction(async (tx) => {
      await tx
        .delete(mentorAvailability)
        .where(eq(mentorAvailability.mentorId, mentorId));

      if (availabilitySlots.length === 0) {
        return [];
      }

      const newSlots = await tx
        .insert(mentorAvailability)
        .values(
          availabilitySlots.map((slot) => ({
            mentorId,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            timezone: slot.timezone ?? "UTC",
            isActive: true,
          })),
        )
        .returning();

      return newSlots;
    });
  }

  async getAvailabilityByDay(
    mentorId: string,
    dayOfWeek: number,
  ): Promise<AvailabilitySlot[]> {
    const availability = await this.db
      .select()
      .from(mentorAvailability)
      .where(
        and(
          eq(mentorAvailability.mentorId, mentorId),
          eq(mentorAvailability.dayOfWeek, dayOfWeek),
          eq(mentorAvailability.isActive, true),
        ),
      )
      .orderBy(mentorAvailability.startTime);

    return availability;
  }

  async toggleAvailabilityDay(
    mentorId: string,
    dayOfWeek: number,
    isActive: boolean,
  ): Promise<void> {
    await this.db
      .update(mentorAvailability)
      .set({
        isActive,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(mentorAvailability.mentorId, mentorId),
          eq(mentorAvailability.dayOfWeek, dayOfWeek),
        ),
      );
  }
}
