import { BaseRepository } from "./base.repository";
import db from "../../prisma";
import type { Webinar, WebinarStatus } from "prisma/generated/client";

export class WebinarRepository extends BaseRepository<Webinar> {
  constructor() {
    super(db.webinar);
  }

  async findByMentorId(mentorId: string): Promise<Webinar[]> {
    return this.model.findMany({
      where: { mentorId },
      include: {
        mentor: {
          include: {
            user: true,
          },
        },
        attendees: {
          include: {
            user: true,
          },
        },
        appointments: true,
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });
  }

  async findByStatus(status: WebinarStatus): Promise<Webinar[]> {
    return this.model.findMany({
      where: { status },
      include: {
        mentor: {
          include: {
            user: true,
          },
        },
        attendees: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  async findUpcomingWebinars(): Promise<Webinar[]> {
    return this.model.findMany({
      where: {
        scheduledAt: {
          gte: new Date(),
        },
        status: {
          in: ["SCHEDULED", "ONGOING"],
        },
      },
      include: {
        mentor: {
          include: {
            user: true,
          },
        },
        attendees: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  async findWebinarsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Webinar[]> {
    return this.model.findMany({
      where: {
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        mentor: {
          include: {
            user: true,
          },
        },
        attendees: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  async updateStatus(
    webinarId: string,
    status: WebinarStatus
  ): Promise<Webinar> {
    return this.model.update({
      where: { id: webinarId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  async addMeetingLink(
    webinarId: string,
    meetingLink: string
  ): Promise<Webinar> {
    return this.model.update({
      where: { id: webinarId },
      data: {
        meetingLink,
        updatedAt: new Date(),
      },
    });
  }

  async addRecordingUrl(
    webinarId: string,
    recordingUrl: string
  ): Promise<Webinar> {
    return this.model.update({
      where: { id: webinarId },
      data: {
        recordingUrl,
        updatedAt: new Date(),
      },
    });
  }

  async getWebinarAttendeeCount(webinarId: string): Promise<number> {
    return db.webinarAttendee.count({
      where: { webinarId },
    });
  }

  async checkAvailableSlots(webinarId: string): Promise<number> {
    const webinar = await this.findById(webinarId);
    if (!webinar?.maxAttendees) return Infinity;

    const attendeeCount = await this.getWebinarAttendeeCount(webinarId);
    return Math.max(0, webinar.maxAttendees - attendeeCount);
  }
}
