import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { initAuth } from "@acme/auth";

import { env } from "~/env";

const baseUrl = "http://localhost:3000";

export const auth = initAuth({
  baseUrl,
  secret: env.AUTH_SECRET,
  googleClientId: env.AUTH_GOOGLE_ID as string,
  googleClientSecret: env.AUTH_GOOGLE_SECRET as string,
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
