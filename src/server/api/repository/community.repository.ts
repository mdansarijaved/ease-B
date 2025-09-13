import { and, count, desc, eq, ilike, sql } from "drizzle-orm";
import type { db as Database } from "~/server/db/client";
import { communityTable, userToCommunitesMapping } from "~/server/db/schema";
import { user } from "~/server/db/auth-schema";

export class CommunityRepository {
  private db: typeof Database;

  constructor(db: typeof Database) {
    this.db = db;
  }

  async createCommunity(data: {
    name: string;
    description: string;
    image: string;
    banner?: string;
    type: string;
    ownerId: string;
  }) {
    const [community] = await this.db
      .insert(communityTable)
      .values({
        name: data.name,
        description: data.description,
        image: data.image,
        banner: data.banner,
        type: data.type,
        ownerId: data.ownerId,
      })
      .returning();

    if (!community) {
      throw new Error("Failed to create community");
    }

    return community;
  }

  async getCommunityById(id: string) {
    const community = await this.db.query.communityTable.findFirst({
      where: eq(communityTable.id, id),
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!community) {
      return null;
    }

    const [memberCount] = await this.db
      .select({ count: count() })
      .from(userToCommunitesMapping)
      .where(eq(userToCommunitesMapping.communityId, id));

    return {
      ...community,
      memberCount: memberCount?.count ?? 0,
    };
  }

  async getUserCommunities(ownerId: string) {
    const communities = await this.db.query.communityTable.findMany({
      where: eq(communityTable.ownerId, ownerId),
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [desc(communityTable.createdAt)],
    });

    const communitiesWithCounts = await Promise.all(
      communities.map(async (community) => {
        const [memberCount] = await this.db
          .select({ count: count() })
          .from(userToCommunitesMapping)
          .where(eq(userToCommunitesMapping.communityId, community.id));

        return {
          ...community,
          memberCount: memberCount?.count ?? 0,
        };
      }),
    );

    return communitiesWithCounts;
  }

  async updateCommunity(
    id: string,
    ownerId: string,
    data: {
      name?: string;
      description?: string;
      image?: string;
      banner?: string;
      type?: string;
      isActive?: boolean;
    },
  ) {
    const [updatedCommunity] = await this.db
      .update(communityTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(eq(communityTable.id, id), eq(communityTable.ownerId, ownerId)),
      )
      .returning();

    if (!updatedCommunity) {
      throw new Error(
        "Community not found or you don't have permission to update it",
      );
    }

    return updatedCommunity;
  }

  async deleteCommunity(id: string, ownerId: string) {
    const [deletedCommunity] = await this.db
      .delete(communityTable)
      .where(
        and(eq(communityTable.id, id), eq(communityTable.ownerId, ownerId)),
      )
      .returning();

    if (!deletedCommunity) {
      throw new Error(
        "Community not found or you don't have permission to delete it",
      );
    }

    return deletedCommunity;
  }

  async addMember(communityId: string, userId: string) {
    const existingMember =
      await this.db.query.userToCommunitesMapping.findFirst({
        where: and(
          eq(userToCommunitesMapping.communityId, communityId),
          eq(userToCommunitesMapping.userId, userId),
        ),
      });

    if (existingMember) {
      throw new Error("User is already a member of this community");
    }

    const [member] = await this.db
      .insert(userToCommunitesMapping)
      .values({
        communityId,
        userId,
      })
      .returning();

    if (!member) {
      throw new Error("Failed to add member to community");
    }

    return member;
  }

  async removeMember(communityId: string, userId: string, ownerId: string) {
    const community = await this.db.query.communityTable.findFirst({
      where: and(
        eq(communityTable.id, communityId),
        eq(communityTable.ownerId, ownerId),
      ),
    });

    if (!community) {
      throw new Error("Community not found or you don't have permission");
    }

    const [removedMember] = await this.db
      .delete(userToCommunitesMapping)
      .where(
        and(
          eq(userToCommunitesMapping.communityId, communityId),
          eq(userToCommunitesMapping.userId, userId),
        ),
      )
      .returning();

    if (!removedMember) {
      throw new Error("Member not found in community");
    }

    return removedMember;
  }

  async getCommunityMembers(communityId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const members = await this.db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        joinedAt: userToCommunitesMapping.createdAt,
      })
      .from(userToCommunitesMapping)
      .innerJoin(user, eq(userToCommunitesMapping.userId, user.id))
      .where(eq(userToCommunitesMapping.communityId, communityId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(userToCommunitesMapping.createdAt));

    const [totalCount] = await this.db
      .select({ count: count() })
      .from(userToCommunitesMapping)
      .where(eq(userToCommunitesMapping.communityId, communityId));

    return {
      members,
      totalCount: totalCount?.count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((totalCount?.count ?? 0) / limit),
    };
  }

  async searchCommunities(query?: string, type?: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query) {
      conditions.push(ilike(communityTable.name, `%${query}%`));
    }

    if (type) {
      conditions.push(eq(communityTable.type, type));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const communities = await this.db.query.communityTable.findMany({
      where: whereClause,
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      limit,
      offset,
      orderBy: [desc(communityTable.createdAt)],
    });

    const [totalCount] = await this.db
      .select({ count: count() })
      .from(communityTable)
      .where(whereClause);

    return {
      communities,
      totalCount: totalCount?.count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((totalCount?.count ?? 0) / limit),
    };
  }

  async getCommunityStats(communityId: string) {
    const [memberCount] = await this.db
      .select({ count: count() })
      .from(userToCommunitesMapping)
      .where(eq(userToCommunitesMapping.communityId, communityId));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentMembers] = await this.db
      .select({ count: count() })
      .from(userToCommunitesMapping)
      .where(
        and(
          eq(userToCommunitesMapping.communityId, communityId),
          sql`${userToCommunitesMapping.createdAt} >= ${thirtyDaysAgo}`,
        ),
      );

    return {
      totalMembers: memberCount?.count ?? 0,
      newMembersThisMonth: recentMembers?.count ?? 0,
      communityId,
    };
  }

  async toggleCommunityStatus(id: string, ownerId: string, isActive: boolean) {
    const [updatedCommunity] = await this.db
      .update(communityTable)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(
        and(eq(communityTable.id, id), eq(communityTable.ownerId, ownerId)),
      )
      .returning();

    if (!updatedCommunity) {
      throw new Error("Community not found or you don't have permission");
    }

    return updatedCommunity;
  }
}
