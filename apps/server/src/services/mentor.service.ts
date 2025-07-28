import { BaseService } from "./base.service";
import { MentorRepository } from "../repositories/mentor.repository";
import { SkillsRepository } from "../repositories/skills.repository";
import { ServicesRepository } from "../repositories/services.repository";
import { TRPCError } from "@trpc/server";
import type { Mentor, DayOfWeek } from "prisma/generated/client";
import db from "../../prisma";

export class MentorService extends BaseService<Mentor> {
  private mentorRepository: MentorRepository;
  private skillsRepository: SkillsRepository;
  private servicesRepository: ServicesRepository;

  constructor() {
    const mentorRepository = new MentorRepository();
    super(mentorRepository);
    this.mentorRepository = mentorRepository;
    this.skillsRepository = new SkillsRepository();
    this.servicesRepository = new ServicesRepository();
  }

  async createMentorProfile(data: {
    userId: string;
    about: string;
    languages: string[];
    timezone: string;
    skills: string[];
    services: Array<{
      serviceId: string;
      price: number;
      duration: number;
      currency?: string;
    }>;
    availability: Array<{
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
    }>;
  }): Promise<Mentor> {
    // Check if user is already a mentor
    const existingMentor = await this.mentorRepository.findByUserId(
      data.userId
    );
    if (existingMentor) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User is already a mentor",
      });
    }

    // Validate skills exist
    const skillsExist = await Promise.all(
      data.skills.map((skillId) => this.skillsRepository.findById(skillId))
    );
    const invalidSkills = skillsExist.filter((skill) => !skill);
    if (invalidSkills.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "One or more skills do not exist",
      });
    }

    // Validate services exist
    const servicesExist = await Promise.all(
      data.services.map((service) =>
        this.servicesRepository.findById(service.serviceId)
      )
    );
    const invalidServices = servicesExist.filter((service) => !service);
    if (invalidServices.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "One or more services do not exist",
      });
    }

    // Create mentor profile with all related data
    const mentor = await db.mentor.create({
      data: {
        id: crypto.randomUUID(),
        userId: data.userId,
        about: data.about,
        languages: data.languages,
        timezone: data.timezone,
        skills: {
          create: data.skills.map((skillId) => ({
            id: crypto.randomUUID(),
            skillId,
          })),
        },
        services: {
          create: data.services.map((service) => ({
            id: crypto.randomUUID(),
            serviceId: service.serviceId,
            price: service.price,
            duration: service.duration,
            currency: service.currency || "USD",
          })),
        },
        availability: {
          create: data.availability.map((avail) => ({
            id: crypto.randomUUID(),
            dayOfWeek: avail.dayOfWeek,
            startTime: avail.startTime,
            endTime: avail.endTime,
          })),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
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
        availability: true,
      },
    });

    return mentor;
  }

  async updateMentorProfile(
    mentorId: string,
    data: {
      about?: string;
      languages?: string[];
      timezone?: string;
    }
  ): Promise<Mentor> {
    const mentor = await this.mentorRepository.findById(mentorId);
    if (!mentor) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Mentor not found",
      });
    }

    return this.mentorRepository.update(mentorId, {
      ...data,
      updatedAt: new Date(),
    });
  }

  async getMentorByUserId(userId: string): Promise<Mentor | null> {
    return this.mentorRepository.findByUserId(userId);
  }

  async searchMentors(filters: {
    skills?: string[];
    services?: string[];
    dayOfWeek?: DayOfWeek;
    priceRange?: { min: number; max: number };
    timezone?: string;
  }): Promise<Mentor[]> {
    let mentors: Mentor[] = [];

    if (filters.skills && filters.skills.length > 0) {
      mentors = await this.mentorRepository.findMentorsWithSkills(
        filters.skills
      );
    } else if (filters.services && filters.services.length > 0) {
      mentors = await this.mentorRepository.findMentorsWithServices(
        filters.services
      );
    } else if (filters.dayOfWeek) {
      mentors = await this.mentorRepository.findMentorsWithAvailability(
        filters.dayOfWeek
      );
    } else {
      mentors = await this.mentorRepository.findMany({
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
        },
      });
    }

    // Apply additional filters
    if (filters.priceRange) {
      mentors = mentors.filter((mentor) =>
        (mentor as any).services?.some(
          (service: any) =>
            service.price >= filters.priceRange!.min &&
            service.price <= filters.priceRange!.max
        )
      );
    }

    if (filters.timezone) {
      mentors = mentors.filter(
        (mentor) => mentor.timezone === filters.timezone
      );
    }

    return mentors;
  }

  async addMentorSkill(mentorId: string, skillId: string): Promise<void> {
    const mentor = await this.mentorRepository.findById(mentorId);
    if (!mentor) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Mentor not found",
      });
    }

    const skill = await this.skillsRepository.findById(skillId);
    if (!skill) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Skill not found",
      });
    }

    await db.mentorSkills.create({
      data: {
        id: crypto.randomUUID(),
        mentorId,
        skillId,
      },
    });
  }

  async removeMentorSkill(mentorId: string, skillId: string): Promise<void> {
    await db.mentorSkills.deleteMany({
      where: {
        mentorId,
        skillId,
      },
    });
  }

  async addMentorService(
    mentorId: string,
    serviceData: {
      serviceId: string;
      price: number;
      duration: number;
      currency?: string;
    }
  ): Promise<void> {
    const mentor = await this.mentorRepository.findById(mentorId);
    if (!mentor) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Mentor not found",
      });
    }

    const service = await this.servicesRepository.findById(
      serviceData.serviceId
    );
    if (!service) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Service not found",
      });
    }

    await db.mentorServices.create({
      data: {
        id: crypto.randomUUID(),
        mentorId,
        serviceId: serviceData.serviceId,
        price: serviceData.price,
        duration: serviceData.duration,
        currency: serviceData.currency || "USD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async updateMentorService(
    mentorServiceId: string,
    data: {
      price?: number;
      duration?: number;
      isActive?: boolean;
    }
  ): Promise<void> {
    await db.mentorServices.update({
      where: { id: mentorServiceId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateMentorAvailability(
    mentorId: string,
    availability: Array<{
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
    }>
  ): Promise<void> {
    // Remove existing availability
    await db.mentorAvailability.deleteMany({
      where: { mentorId },
    });

    // Add new availability
    await db.mentorAvailability.createMany({
      data: availability.map((avail) => ({
        id: crypto.randomUUID(),
        mentorId,
        dayOfWeek: avail.dayOfWeek,
        startTime: avail.startTime,
        endTime: avail.endTime,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
  }

  async getMentorStats(mentorId: string) {
    const mentor = await this.mentorRepository.findById(mentorId);
    if (!mentor) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Mentor not found",
      });
    }

    return this.mentorRepository.getMentorStats(mentorId);
  }

  async getMentorRating(
    mentorId: string
  ): Promise<{ averageRating: number; totalReviews: number }> {
    const appointments = await db.appointment.findMany({
      where: {
        mentorId,
        rating: { not: null },
      },
      select: {
        rating: true,
      },
    });

    const totalReviews = appointments.length;
    const averageRating =
      totalReviews > 0
        ? appointments.reduce((sum, app) => sum + (app.rating || 0), 0) /
          totalReviews
        : 0;

    return { averageRating, totalReviews };
  }
}
