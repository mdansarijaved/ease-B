import { BaseRepository } from "./base.repository";
import db from "../../prisma";
import type { Role } from "prisma/generated/enums";
import type { User } from "prisma/generated/client";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(db.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  async findByRole(role: Role): Promise<User[]> {
    return this.model.findMany({
      where: { role },
    });
  }

  async updateRole(userId: string, role: Role): Promise<User> {
    return this.model.update({
      where: { id: userId },
      data: { role },
    });
  }

  async getUsersWithSessions(): Promise<User[]> {
    return this.model.findMany({
      include: {
        sessions: true,
      },
    });
  }
}
