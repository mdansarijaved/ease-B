import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession, oAuthProxy } from "better-auth/plugins";

import { db } from "@acme/db/client";

import { fetchUserRole } from "./fetchUserRole";

export function initAuth(options: {
  baseUrl: string;
  secret: string | undefined;

  googleClientId: string;
  googleClientSecret: string;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        /**
         * Auto-inference blocked by https://github.com/better-auth/better-auth/pull/2891
         */
        currentURL: options.baseUrl,
      }),
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
    socialProviders: {
      google: {
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
      },
    },
    trustedOrigins: ["expo://", "http://localhost:3000"],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
