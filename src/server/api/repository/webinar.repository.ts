import { and, count, desc, eq, gte, ilike, lt, lte, sql } from "drizzle-orm";
import type { db as Database } from "~/server/db/client";
import { webinar } from "~/server/db/schema";
import { user } from "~/server/db/auth-schema";

export class WebinarRepository {
  private db: typeof Database;

  constructor(db: typeof Database) {
    this.db = db;
  }

  async createWebinar(data: {
    title: string;
    description: string;
    banner: string;
    startDate: Date;
    endDate: Date;
    ownerId: string;
  }) {
    const [newWebinar] = await this.db
      .insert(webinar)
      .values({
        title: data.title,
        description: data.description,
        banner: data.banner,
        startDate: data.startDate,
        endDate: data.endDate,
        ownerId: data.ownerId,
      })
      .returning();

    if (!newWebinar) {
      throw new Error("Failed to create webinar");
    }

    return newWebinar;
  }

  async getWebinarById(id: string) {
    const webinarRecord = await this.db
      .select({
        id: webinar.id,
        title: webinar.title,
        description: webinar.description,
        banner: webinar.banner,
        startDate: webinar.startDate,
        endDate: webinar.endDate,
        isActive: webinar.isActive,
        createdAt: webinar.createdAt,
        updatedAt: webinar.updatedAt,
        owner: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(webinar)
      .innerJoin(user, eq(webinar.ownerId, user.id))
      .where(eq(webinar.id, id))
      .limit(1);

    return webinarRecord[0] ?? null;
  }

  async getUserWebinars(
    ownerId: string,
    page = 1,
    limit = 20,
    status: "upcoming" | "ongoing" | "completed" | "all" = "all",
    search?: string,
  ) {
    const offset = (page - 1) * limit;
    const now = new Date();

    const conditions = [eq(webinar.ownerId, ownerId)];

    if (status === "upcoming") {
      conditions.push(gte(webinar.startDate, now));
    } else if (status === "ongoing") {
      const ongoingCondition = and(
        lte(webinar.startDate, now),
        gte(webinar.endDate, now),
      );
      if (ongoingCondition) {
        conditions.push(ongoingCondition);
      }
    } else if (status === "completed") {
      conditions.push(lt(webinar.endDate, now));
    }

    if (search) {
      conditions.push(ilike(webinar.title, `%${search}%`));
    }

    const webinars = await this.db
      .select({
        id: webinar.id,
        title: webinar.title,
        description: webinar.description,
        banner: webinar.banner,
        startDate: webinar.startDate,
        endDate: webinar.endDate,
        isActive: webinar.isActive,
        createdAt: webinar.createdAt,
        updatedAt: webinar.updatedAt,
      })
      .from(webinar)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(webinar.startDate));

    const [totalCount] = await this.db
      .select({ count: count() })
      .from(webinar)
      .where(and(...conditions));

    return {
      webinars,
      totalCount: totalCount?.count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((totalCount?.count ?? 0) / limit),
    };
  }

  async updateWebinar(
    id: string,
    ownerId: string,
    data: {
      title?: string;
      description?: string;
      banner?: string;
      startDate?: Date;
      endDate?: Date;
      isActive?: boolean;
    },
  ) {
    const [updatedWebinar] = await this.db
      .update(webinar)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(webinar.id, id), eq(webinar.ownerId, ownerId)))
      .returning();

    if (!updatedWebinar) {
      throw new Error(
        "Webinar not found or you don't have permission to update it",
      );
    }

    return updatedWebinar;
  }

  async deleteWebinar(id: string, ownerId: string) {
    const [deletedWebinar] = await this.db
      .delete(webinar)
      .where(and(eq(webinar.id, id), eq(webinar.ownerId, ownerId)))
      .returning();

    if (!deletedWebinar) {
      throw new Error(
        "Webinar not found or you don't have permission to delete it",
      );
    }

    return deletedWebinar;
  }

  async getWebinarStats(ownerId: string) {
    const now = new Date();

    const [totalWebinars] = await this.db
      .select({ count: count() })
      .from(webinar)
      .where(eq(webinar.ownerId, ownerId));

    const [upcomingWebinars] = await this.db
      .select({ count: count() })
      .from(webinar)
      .where(and(eq(webinar.ownerId, ownerId), gte(webinar.startDate, now)));

    const [ongoingWebinars] = await this.db
      .select({ count: count() })
      .from(webinar)
      .where(
        and(
          eq(webinar.ownerId, ownerId),
          lte(webinar.startDate, now),
          gte(webinar.endDate, now),
        ),
      );

    const [completedWebinars] = await this.db
      .select({ count: count() })
      .from(webinar)
      .where(and(eq(webinar.ownerId, ownerId), lt(webinar.endDate, now)));

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [thisMonthWebinars] = await this.db
      .select({ count: count() })
      .from(webinar)
      .where(
        and(eq(webinar.ownerId, ownerId), gte(webinar.createdAt, startOfMonth)),
      );

    return {
      total: totalWebinars?.count ?? 0,
      upcoming: upcomingWebinars?.count ?? 0,
      ongoing: ongoingWebinars?.count ?? 0,
      completed: completedWebinars?.count ?? 0,
      thisMonth: thisMonthWebinars?.count ?? 0,
    };
  }

  async getWebinarAnalytics(ownerId: string, startDate?: Date, endDate?: Date) {
    const conditions = [eq(webinar.ownerId, ownerId)];

    if (startDate) {
      conditions.push(gte(webinar.createdAt, startDate));
    }

    if (endDate) {
      conditions.push(lte(webinar.createdAt, endDate));
    }

    if (!startDate && !endDate) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      conditions.push(gte(webinar.createdAt, sixMonthsAgo));
    }

    const webinarsData = await this.db
      .select({
        month: sql<string>`TO_CHAR(${webinar.createdAt}, 'YYYY-MM')`,
        count: count(),
      })
      .from(webinar)
      .where(and(...conditions))
      .groupBy(sql`TO_CHAR(${webinar.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${webinar.createdAt}, 'YYYY-MM')`);

    return webinarsData;
  }

  async toggleWebinarStatus(id: string, ownerId: string, isActive: boolean) {
    const [updatedWebinar] = await this.db
      .update(webinar)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(and(eq(webinar.id, id), eq(webinar.ownerId, ownerId)))
      .returning();

    if (!updatedWebinar) {
      throw new Error("Webinar not found or you don't have permission");
    }

    return updatedWebinar;
  }

  async getUpcomingWebinars(ownerId: string, limit = 5) {
    const now = new Date();

    const webinars = await this.db
      .select({
        id: webinar.id,
        title: webinar.title,
        startDate: webinar.startDate,
        endDate: webinar.endDate,
        banner: webinar.banner,
      })
      .from(webinar)
      .where(
        and(
          eq(webinar.ownerId, ownerId),
          gte(webinar.startDate, now),
          eq(webinar.isActive, true),
        ),
      )
      .limit(limit)
      .orderBy(webinar.startDate);

    return webinars;
  }

  async searchWebinars(query?: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const now = new Date();

    const conditions = [
      eq(webinar.isActive, true),
      gte(webinar.startDate, now),
    ];

    if (query) {
      conditions.push(ilike(webinar.title, `%${query}%`));
    }

    const webinars = await this.db
      .select({
        id: webinar.id,
        title: webinar.title,
        description: webinar.description,
        banner: webinar.banner,
        startDate: webinar.startDate,
        endDate: webinar.endDate,
        owner: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(webinar)
      .innerJoin(user, eq(webinar.ownerId, user.id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(webinar.startDate);

    const [totalCount] = await this.db
      .select({ count: count() })
      .from(webinar)
      .where(and(...conditions));

    return {
      webinars,
      totalCount: totalCount?.count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((totalCount?.count ?? 0) / limit),
    };
  }
}
