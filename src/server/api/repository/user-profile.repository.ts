import { eq } from "drizzle-orm";

import type { db as Database } from "~/server/db/client";
import {
  skills,
  userEducation,
  userProfileTable,
  userProfileToSkills,
  userWorkHistory,
} from "~/server/db/schema";
import type { userProfileFormSchemaType } from "~/vlidators";

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

  async createUserProfile(userID: string, data: userProfileFormSchemaType) {
    const existing = await this.db
      .select()
      .from(userProfileTable)
      .where(eq(userProfileTable.userId, userID));

    if (existing.length > 0) {
      throw new Error("User profile already exists");
    }

    const userprofile = await this.db.transaction(async (tx) => {
      const [newProfile] = await tx
        .insert(userProfileTable)
        .values({
          userId: userID,
          bio: data.bio,
        })
        .returning();

      if (!newProfile) {
        tx.rollback();
        throw new Error("Failed to create user profile");
      }

      const userProfileId = newProfile.id;

      if (data.skills.length > 0) {
        const skillsId = await Promise.all(
          data.skills.map(async ({ skill }) => {
            const [insertedSkills] = await tx
              .insert(skills)
              .values({
                name: skill.name,
                description: skill.description,
              })
              .onConflictDoUpdate({
                target: skills.name,
                set: {
                  description: skill.description,
                },
              })
              .returning({ id: skills.id });
            if (!insertedSkills) {
              tx.rollback();
              throw new Error("Failed to create skill");
            }
            return insertedSkills;
          }),
        );

        await tx.insert(userProfileToSkills).values(
          data.skills.map((s, index) => ({
            userProfileId,
            // @ts-expect-error type
            skillId: skillsId[index].id,
            proficiencyLevel: s.proficiencyLevel,
          })),
        );
      }

      if (data.education.length > 0) {
        await tx.insert(userEducation).values(
          data.education.map((edu) => ({
            userProfileId,
            institution: edu.institution,
            degree: edu.degree,
            active: edu.active,
            startYear: new Date(edu.startYear).getFullYear(),
            endYear: edu.endYear ? new Date(edu.endYear).getFullYear() : null,
            description: edu.description,
          })),
        );
      }

      if (data.experience.length > 0) {
        await tx.insert(userWorkHistory).values(
          data.experience.map((exp) => ({
            userProfileId,
            company: exp.company,
            position: exp.position,
            startDate: new Date(exp.startDate).toDateString(),
            endDate: exp.endDate ? new Date(exp.endDate).toDateString() : null,
            current: exp.current,
            description: exp.description,
          })),
        );
      }

      const fullProfile = await tx.query.userProfileTable.findFirst({
        where: eq(userProfileTable.id, userProfileId),
        with: {
          userProfileToSkills: {
            with: {
              skill: true,
            },
          },
          userEducation: true,
          userWorkHistory: true,
        },
      });

      return fullProfile;
    });

    return userprofile;
  }
}
