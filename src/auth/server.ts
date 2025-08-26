import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { env } from "~/env";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/server/db/client";
import { fetchUserRole } from "./fetchUser";
import { customSession } from "better-auth/plugins";

const baseUrl = "http://localhost:3000";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: baseUrl,
  secret: env.AUTH_SECRET,

  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
  trustedOrigins: ["http://localhost:3000"],
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

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
