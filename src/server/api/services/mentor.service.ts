import { eq } from "drizzle-orm";
import type { db as Database } from "~/server/db/client";
import { mentorTable, userProfileTable } from "~/server/db/schema";

export class MentorService {
  private db: typeof Database;

  constructor(db: typeof Database) {
    this.db = db;
  }

  async getOrCreateMentorProfile(userId: string) {
    try {
      return await this.db.transaction(async (tx) => {
        let userProfile = await tx.query.userProfileTable.findFirst({
          where: eq(userProfileTable.userId, userId),
        });

        if (!userProfile) {
          const [newUserProfile] = await tx
            .insert(userProfileTable)
            .values({
              userId,
              bio: "New mentor profile",
            })
            .returning();

          if (!newUserProfile) {
            throw new Error("Failed to create user profile");
          }

          userProfile = newUserProfile;
        }

        let mentorRecord = await tx.query.mentorTable.findFirst({
          where: eq(mentorTable.userProfileId, userProfile.id),
          with: {
            userProfile: true,
          },
        });

        if (!mentorRecord) {
          const [newMentorRecord] = await tx
            .insert(mentorTable)
            .values({
              userProfileId: userProfile.id,
              yearsOfExperience: 0,
              isActive: true,
              isVerified: false,
              rating: "0.00",
              totalSessions: 0,
              introduction:
                "Welcome! I'm excited to help you on your learning journey.",
            })
            .returning();

          if (!newMentorRecord) {
            throw new Error("Failed to create mentor profile");
          }

          mentorRecord = await tx.query.mentorTable.findFirst({
            where: eq(mentorTable.id, newMentorRecord.id),
            with: {
              userProfile: true,
            },
          });

          if (!mentorRecord) {
            throw new Error("Failed to fetch created mentor profile");
          }
        }

        return mentorRecord;
      });
    } catch (error) {
      console.error("Error in getOrCreateMentorProfile:", error);
      throw error;
    }
  }

  /**
   * Gets an existing mentor profile without creating one
   * Returns null if no mentor profile exists
   */
  async getMentorProfile(userId: string) {
    const userProfile = await this.db.query.userProfileTable.findFirst({
      where: eq(userProfileTable.userId, userId),
    });

    if (!userProfile) {
      return null;
    }

    const mentorRecord = await this.db.query.mentorTable.findFirst({
      where: eq(mentorTable.userProfileId, userProfile.id),
      with: {
        userProfile: true,
      },
    });

    return mentorRecord;
  }

  /**
   * Checks if a user has a mentor profile
   */
  async hasMentorProfile(userId: string): Promise<boolean> {
    const mentorProfile = await this.getMentorProfile(userId);
    return !!mentorProfile;
  }
}
