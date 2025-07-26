import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../../prisma";
import { customSession } from "better-auth/plugins";
import { fetchUserRole } from "../services/user";
import { resend } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log("URL", url);
      console.log("Token", token);
      const urlObj = new URL(url);
      urlObj.searchParams.set("callbackURL", "/dashboard?welcome=true");
      url = urlObj.toString();
      const { data, error } = await resend.emails.send({
        from: "Acme <javed@no-reply.butterjam.dev>",
        to: [user.email],
        subject: "Verify your email",
        html: `<p>Click <a href="${url}">here</a> to verify your email</p>`,
      });

      console.log("Data", data);
      if (error) {
        console.error(error);
      }
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
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
