import { BaseRepository } from "./base.repository";
import db from "../../prisma";
import type { Services } from "prisma/generated/client";

export class ServicesRepository extends BaseRepository<Services> {
  constructor() {
    super(db.services);
  }

  async findByName(name: string): Promise<Services | null> {
    return this.model.findUnique({
      where: { name },
    });
  }

  async findServicesWithMentors(): Promise<Services[]> {
    return this.model.findMany({
      include: {
        mentorServices: {
          where: {
            isActive: true,
          },
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

  async getPopularServices(limit: number = 10): Promise<Services[]> {
    return this.model.findMany({
      include: {
        _count: {
          select: {
            mentorServices: true,
          },
        },
      },
      orderBy: {
        mentorServices: {
          _count: "desc",
        },
      },
      take: limit,
    });
  }
}
