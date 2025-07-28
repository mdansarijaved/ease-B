import { BaseRepository } from "./base.repository";
import db from "../../prisma";
import type { Skills } from "prisma/generated/client";

export class SkillsRepository extends BaseRepository<Skills> {
  constructor() {
    super(db.skills);
  }

  async findByName(name: string): Promise<Skills | null> {
    return this.model.findUnique({
      where: { name },
    });
  }

  async findSkillsWithMentors(): Promise<Skills[]> {
    return this.model.findMany({
      include: {
        mentorSkills: {
          include: {
            mentor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async getPopularSkills(limit: number = 10): Promise<Skills[]> {
    return this.model.findMany({
      include: {
        _count: {
          select: {
            mentorSkills: true,
          },
        },
      },
      orderBy: {
        mentorSkills: {
          _count: "desc",
        },
      },
      take: limit,
    });
  }
}
