import { BaseService } from "./base.service";
import { WebinarRepository } from "../repositories/webinar.repository";
import { MentorRepository } from "../repositories/mentor.repository";
import { TRPCError } from "@trpc/server";
import type { Webinar, WebinarStatus } from "prisma/generated/client";
import db from "../../prisma";

export class WebinarService extends BaseService<Webinar> {
  private webinarRepository: WebinarRepository;
  private mentorRepository: MentorRepository;

  constructor() {
    const webinarRepository = new WebinarRepository();
    super(webinarRepository);
    this.webinarRepository = webinarRepository;
    this.mentorRepository = new MentorRepository();
  }

  async createWebinar(data: {
    mentorId: string;
    title: string;
    description?: string;
    price: number;
    currency: string;
    maxAttendees?: number;
    scheduledAt: Date;
    duration: number;
  }): Promise<Webinar> {
    const mentor = await this.mentorRepository.findById(data.mentorId);
    if (!mentor) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Mentor not found",
      });
    }

    if (data.scheduledAt < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot schedule webinars in the past",
      });
    }

    if (data.duration < 15) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Webinar duration must be at least 15 minutes",
      });
    }

    const webinar = await this.webinarRepository.create({
      id: crypto.randomUUID(),
      mentorId: data.mentorId,
      title: data.title,
      description: data.description,
      price: data.price,
      currency: data.currency,
      maxAttendees: data.maxAttendees,
      scheduledAt: data.scheduledAt,
      duration: data.duration,
      status: "SCHEDULED",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return webinar;
  }

  async updateWebinarStatus(
    webinarId: string,
    status: WebinarStatus,
    mentorId?: string
  ): Promise<Webinar> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Webinar not found",
      });
    }

    if (mentorId && webinar.mentorId !== mentorId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not authorized to update this webinar",
      });
    }

    if (webinar.status === "COMPLETED" && status !== "COMPLETED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot change status of completed webinar",
      });
    }

    if (webinar.status === "CANCELLED" && status !== "CANCELLED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot change status of cancelled webinar",
      });
    }

    return this.webinarRepository.updateStatus(webinarId, status);
  }

  async registerForWebinar(webinarId: string, userId: string): Promise<void> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Webinar not found",
      });
    }

    if (webinar.status !== "SCHEDULED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Webinar is not available for registration",
      });
    }

    if (webinar.scheduledAt < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot register for past webinars",
      });
    }

    const existingRegistration = await db.webinarAttendee.findUnique({
      where: {
        webinarId_userId: {
          webinarId,
          userId,
        },
      },
    });

    if (existingRegistration) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User is already registered for this webinar",
      });
    }

    const availableSlots =
      await this.webinarRepository.checkAvailableSlots(webinarId);
    if (availableSlots <= 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Webinar is full",
      });
    }

    await db.webinarAttendee.create({
      data: {
        id: crypto.randomUUID(),
        webinarId,
        userId,
        status: "REGISTERED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async unregisterFromWebinar(
    webinarId: string,
    userId: string
  ): Promise<void> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Webinar not found",
      });
    }

    if (webinar.status === "ONGOING" || webinar.status === "COMPLETED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot unregister from ongoing or completed webinars",
      });
    }

    const deleted = await db.webinarAttendee.deleteMany({
      where: {
        webinarId,
        userId,
      },
    });

    if (deleted.count === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User is not registered for this webinar",
      });
    }
  }

  async getMentorWebinars(mentorId: string): Promise<Webinar[]> {
    return this.webinarRepository.findByMentorId(mentorId);
  }

  async getUpcomingWebinars(): Promise<Webinar[]> {
    return this.webinarRepository.findUpcomingWebinars();
  }

  async getUserWebinars(userId: string): Promise<Webinar[]> {
    return db.webinar.findMany({
      where: {
        attendees: {
          some: {
            userId,
          },
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
        scheduledAt: "desc",
      },
    });
  }

  async addMeetingLink(
    webinarId: string,
    meetingLink: string,
    mentorId?: string
  ): Promise<Webinar> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Webinar not found",
      });
    }

    if (mentorId && webinar.mentorId !== mentorId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not authorized to update this webinar",
      });
    }

    return this.webinarRepository.addMeetingLink(webinarId, meetingLink);
  }

  async addRecordingUrl(
    webinarId: string,
    recordingUrl: string,
    mentorId?: string
  ): Promise<Webinar> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Webinar not found",
      });
    }

    if (mentorId && webinar.mentorId !== mentorId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not authorized to update this webinar",
      });
    }

    if (webinar.status !== "COMPLETED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Can only add recording to completed webinars",
      });
    }

    return this.webinarRepository.addRecordingUrl(webinarId, recordingUrl);
  }

  async recordAttendeeJoin(webinarId: string, userId: string): Promise<void> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Webinar not found",
      });
    }

    const registration = await db.webinarAttendee.findUnique({
      where: {
        webinarId_userId: {
          webinarId,
          userId,
        },
      },
    });

    if (!registration) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User is not registered for this webinar",
      });
    }

    await db.webinarAttendee.update({
      where: {
        webinarId_userId: {
          webinarId,
          userId,
        },
      },
      data: {
        joinedAt: new Date(),
        status: "JOINED",
        updatedAt: new Date(),
      },
    });
  }

  async getWebinarStats(webinarId: string): Promise<{
    totalAttendees: number;
    joinedAttendees: number;
    availableSlots: number;
  }> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Webinar not found",
      });
    }

    const [totalAttendees, joinedAttendees, availableSlots] = await Promise.all(
      [
        this.webinarRepository.getWebinarAttendeeCount(webinarId),
        db.webinarAttendee.count({
          where: {
            webinarId,
            joinedAt: { not: null },
          },
        }),
        this.webinarRepository.checkAvailableSlots(webinarId),
      ]
    );

    return {
      totalAttendees,
      joinedAttendees,
      availableSlots,
    };
  }
}
