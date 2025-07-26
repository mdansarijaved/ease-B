import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  redirects: {
    signIn: "/", // Where to go after sign in (frontend route)
    signUp: "/", // Where to go after sign up (frontend route)
    error: "/",
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          input: false,
        },
      },
    }),
  ],
});
