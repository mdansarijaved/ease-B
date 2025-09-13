import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userprofileRouter } from "./router/user-profile.router";
import { authRouter } from "./router/auth";
import { bookingRouter } from "./router/booking.router";
import { availabilityRouter } from "./router/availability.router";
import { communityRouter } from "./router/community.router";
import { webinarRouter } from "./router/webinar.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  userProfile: userprofileRouter,
  booking: bookingRouter,
  availability: availabilityRouter,
  community: communityRouter,
  webinar: webinarRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
