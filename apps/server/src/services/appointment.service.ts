import { BaseService } from "./base.service";
import { AppointmentRepository } from "../repositories/appointment.repository";
import { MentorRepository } from "../repositories/mentor.repository";
import { TRPCError } from "@trpc/server";
import type { Appointment, AppointmentStatus } from "prisma/generated/client";
import db from "../../prisma";

export class AppointmentService extends BaseService<Appointment> {
  private appointmentRepository: AppointmentRepository;
  private mentorRepository: MentorRepository;

  constructor() {
    const appointmentRepository = new AppointmentRepository();
    super(appointmentRepository);
    this.appointmentRepository = appointmentRepository;
    this.mentorRepository = new MentorRepository();
  }

  async createAppointment(data: {
    mentorId: string;
    userId: string;
    serviceId?: string;
    webinarId?: string;
    scheduledAt: Date;
    duration: number;
    notes?: string;
  }): Promise<Appointment> {
    // Validate mentor exists
    const mentor = await this.mentorRepository.findById(data.mentorId);
    if (!mentor) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Mentor not found",
      });
    }

    // Check for scheduling conflicts
    const conflicts =
      await this.appointmentRepository.findConflictingAppointments(
        data.mentorId,
        data.scheduledAt,
        data.duration
      );

    if (conflicts.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Time slot is not available",
      });
    }

    // Validate appointment is in the future
    if (data.scheduledAt < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot schedule appointments in the past",
      });
    }

    // Create appointment
    const appointment = await this.appointmentRepository.create({
      id: crypto.randomUUID(),
      mentorId: data.mentorId,
      userId: data.userId,
      serviceId: data.serviceId,
      webinarId: data.webinarId,
      scheduledAt: data.scheduledAt,
      duration: data.duration,
      notes: data.notes,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return appointment;
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
    userId: string,
    userRole?: string
  ): Promise<Appointment> {
    const appointment =
      await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Appointment not found",
      });
    }

    // Check authorization
    const isAuthorized =
      appointment.userId === userId ||
      appointment.mentorId === userId ||
      userRole === "ADMIN" ||
      userRole === "SUPER_ADMIN";

    if (!isAuthorized) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not authorized to update this appointment",
      });
    }

    // Business logic for status transitions
    if (appointment.status === "COMPLETED" && status !== "COMPLETED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot change status of completed appointment",
      });
    }

    if (appointment.status === "CANCELLED" && status !== "CANCELLED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot change status of cancelled appointment",
      });
    }

    return this.appointmentRepository.updateStatus(appointmentId, status);
  }

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByUserId(userId);
  }

  async getMentorAppointments(mentorId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByMentorId(mentorId);
  }

  async getUpcomingAppointments(
    userId?: string,
    mentorId?: string
  ): Promise<Appointment[]> {
    return this.appointmentRepository.findUpcomingAppointments(
      mentorId,
      userId
    );
  }

  async addRatingAndReview(
    appointmentId: string,
    rating: number,
    review: string,
    userId: string
  ): Promise<Appointment> {
    const appointment =
      await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Appointment not found",
      });
    }

    // Only the user who booked the appointment can rate
    if (appointment.userId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only the appointment booker can add rating",
      });
    }

    // Can only rate completed appointments
    if (appointment.status !== "COMPLETED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Can only rate completed appointments",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Rating must be between 1 and 5",
      });
    }

    return this.appointmentRepository.addRatingAndReview(
      appointmentId,
      rating,
      review
    );
  }

  async rescheduleAppointment(
    appointmentId: string,
    newScheduledAt: Date,
    userId: string,
    userRole?: string
  ): Promise<Appointment> {
    const appointment =
      await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Appointment not found",
      });
    }

    // Check authorization
    const isAuthorized =
      appointment.userId === userId ||
      appointment.mentorId === userId ||
      userRole === "ADMIN" ||
      userRole === "SUPER_ADMIN";

    if (!isAuthorized) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not authorized to reschedule this appointment",
      });
    }

    // Cannot reschedule past appointments
    if (appointment.scheduledAt < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot reschedule past appointments",
      });
    }

    // New time must be in the future
    if (newScheduledAt < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "New appointment time must be in the future",
      });
    }

    // Check for conflicts at new time
    const conflicts =
      await this.appointmentRepository.findConflictingAppointments(
        appointment.mentorId,
        newScheduledAt,
        appointment.duration
      );

    // Exclude the current appointment from conflict check
    const actualConflicts = conflicts.filter(
      (conflict) => conflict.id !== appointmentId
    );
    if (actualConflicts.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "New time slot is not available",
      });
    }

    return this.appointmentRepository.update(appointmentId, {
      scheduledAt: newScheduledAt,
      status: "PENDING", // Reset to pending when rescheduled
      updatedAt: new Date(),
    });
  }

  async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date,
    mentorId?: string,
    userId?: string
  ): Promise<Appointment[]> {
    const where: any = {
      scheduledAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (mentorId) where.mentorId = mentorId;
    if (userId) where.userId = userId;

    return db.appointment.findMany({
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
        webinar: true,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }
}
