import { BaseService } from "./base.service";
import { UserRepository } from "../repositories/user.repository";

import { TRPCError } from "@trpc/server";
import type { Role, User } from "prisma/generated/client";

export class UserService extends BaseService<User> {
  private userRepository: UserRepository;

  constructor() {
    const userRepository = new UserRepository();
    super(userRepository);
    this.userRepository = userRepository;
  }

  async getUserRole(userId: string): Promise<Role | null> {
    const user = await this.userRepository.findById(userId);
    return user?.role || null;
  }

  async updateUserRole(userId: string, newRole: Role): Promise<User> {
    if (newRole === "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot assign SUPER_ADMIN role",
      });
    }

    return this.userRepository.updateRole(userId, newRole);
  }

  async getMentors(): Promise<User[]> {
    return this.userRepository.findByRole("MENTOR");
  }

  async getUsersWithSessions(): Promise<User[]> {
    return this.userRepository.getUsersWithSessions();
  }
}
