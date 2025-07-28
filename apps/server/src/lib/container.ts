import { UserService } from "../services/user.service";
import { MentorService } from "../services/mentor.service";
import { AppointmentService } from "../services/appointment.service";
import { WebinarService } from "../services/webinar.service";
import { UserRepository } from "../repositories/user.repository";
import { MentorRepository } from "../repositories/mentor.repository";
import { SkillsRepository } from "../repositories/skills.repository";
import { ServicesRepository } from "../repositories/services.repository";
import { AppointmentRepository } from "../repositories/appointment.repository";
import { WebinarRepository } from "../repositories/webinar.repository";

class Container {
  private services: Map<string, any> = new Map();

  constructor() {
    this.registerServices();
  }

  private registerServices() {
    const userRepository = new UserRepository();
    const mentorRepository = new MentorRepository();
    const skillsRepository = new SkillsRepository();
    const servicesRepository = new ServicesRepository();
    const appointmentRepository = new AppointmentRepository();
    const webinarRepository = new WebinarRepository();

    const userService = new UserService();
    const mentorService = new MentorService();
    const appointmentService = new AppointmentService();
    const webinarService = new WebinarService();

    this.services.set("userService", userService);
    this.services.set("mentorService", mentorService);
    this.services.set("appointmentService", appointmentService);
    this.services.set("webinarService", webinarService);

    this.services.set("userRepository", userRepository);
    this.services.set("mentorRepository", mentorRepository);
    this.services.set("skillsRepository", skillsRepository);
    this.services.set("servicesRepository", servicesRepository);
    this.services.set("appointmentRepository", appointmentRepository);
    this.services.set("webinarRepository", webinarRepository);
  }

  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found`);
    }
    return service;
  }
}

export const container = new Container();
