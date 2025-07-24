import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../../prisma";
import { customSession } from "better-auth/plugins";
import { fetchUserRole } from "../services/user";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const role = await fetchUserRole(user.id);
      return {
        user: {
          ...user,
          role,
        },

        session,
      };
    }),
  ],
});
