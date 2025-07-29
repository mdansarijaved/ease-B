import { BaseRepository } from "./base.repository";
import db from "../../prisma";
import type {
  Mentor,
  DayOfWeek,
  AppointmentStatus,
  Prisma,
} from "prisma/generated/client";
export class MentorRepository extends BaseRepository<Mentor> {
  constructor() {
    super(db.mentor);
  }

  async findByUserId(userId: string): Promise<Mentor | null> {
    return this.model.findUnique({
      where: { userId },
      include: {
        user: true,
        skills: {
          include: {
            skill: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },

        availability: true,
        webinars: true,
        appointments: {
          include: {
            user: true,
            service: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });
  }

  async findMentorsWithSkills(skillIds: string[]): Promise<Mentor[]> {
    return this.model.findMany({
      where: {
        skills: {
          some: {
            skillId: {
              in: skillIds,
            },
          },
        },
      },
      include: {
        user: true,
        skills: {
          include: {
            skill: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async findMentorsWithServices(serviceIds: string[]): Promise<Mentor[]> {
    return this.model.findMany({
      where: {
        services: {
          some: {
            serviceId: {
              in: serviceIds,
            },
            isActive: true,
          },
        },
      },
      include: {
        user: true,
        services: {
          where: {
            isActive: true,
          },
          include: {
            service: true,
          },
        },
      },
    });
  }

  async findMentorsWithAvailability(dayOfWeek: DayOfWeek): Promise<Mentor[]> {
    return this.model.findMany({
      where: {
        availability: {
          some: {
            dayOfWeek,
            isActive: true,
          },
        },
      },
      include: {
        user: true,
        availability: {
          where: {
            dayOfWeek,
            isActive: true,
          },
        },
      },
    });
  }

  async getMentorStats(mentorId: string) {
    const [totalAppointments, completedAppointments, totalWebinars] =
      await Promise.all([
        db.appointment.count({
          where: { mentorId },
        }),
        db.appointment.count({
          where: { mentorId, status: "COMPLETED" },
        }),
        db.webinar.count({
          where: { mentorId },
        }),
      ]);

    return {
      totalAppointments,
      completedAppointments,
      totalWebinars,
    };
  }
}
