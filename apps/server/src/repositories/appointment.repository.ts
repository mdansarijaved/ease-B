import { BaseRepository } from "./base.repository";
import db from "../../prisma";
import type { Appointment, AppointmentStatus } from "prisma/generated/client";

export class AppointmentRepository extends BaseRepository<Appointment> {
  constructor() {
    super(db.appointment);
  }

  async findByMentorId(mentorId: string): Promise<Appointment[]> {
    return this.model.findMany({
      where: { mentorId },
      include: {
        user: true,
        mentor: {
          include: {
            user: true,
          },
        },
        service: {
          include: {
            service: true,
          },
        },
        webinar: true,
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });
  }

  async findByUserId(userId: string): Promise<Appointment[]> {
    return this.model.findMany({
      where: { userId },
      include: {
        mentor: {
          include: {
            user: true,
          },
        },
        service: {
          include: {
            service: true,
          },
        },
        webinar: true,
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });
  }

  async findByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    return this.model.findMany({
      where: { status },
      include: {
        user: true,
        mentor: {
          include: {
            user: true,
          },
        },
        service: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  async findUpcomingAppointments(
    mentorId?: string,
    userId?: string
  ): Promise<Appointment[]> {
    const where: any = {
      scheduledAt: {
        gte: new Date(),
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    };

    if (mentorId) where.mentorId = mentorId;
    if (userId) where.userId = userId;

    return this.model.findMany({
      where,
      include: {
        user: true,
        mentor: {
          include: {
            user: true,
          },
        },
        service: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  async findConflictingAppointments(
    mentorId: string,
    scheduledAt: Date,
    duration: number
  ): Promise<Appointment[]> {
    const endTime = new Date(scheduledAt.getTime() + duration * 60000);

    return this.model.findMany({
      where: {
        mentorId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        OR: [
          {
            AND: [
              { scheduledAt: { lte: scheduledAt } },
              {
                scheduledAt: {
                  gte: new Date(scheduledAt.getTime() - duration * 60000),
                },
              },
            ],
          },
          {
            AND: [
              { scheduledAt: { gte: scheduledAt } },
              { scheduledAt: { lte: endTime } },
            ],
          },
        ],
      },
    });
  }

  async updateStatus(
    appointmentId: string,
    status: AppointmentStatus
  ): Promise<Appointment> {
    return this.model.update({
      where: { id: appointmentId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  async addRatingAndReview(
    appointmentId: string,
    rating: number,
    review?: string
  ): Promise<Appointment> {
    return this.model.update({
      where: { id: appointmentId },
      data: {
        rating,
        review,
        updatedAt: new Date(),
      },
    });
  }
}
