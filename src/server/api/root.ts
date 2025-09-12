import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userprofileRouter } from "./router/user-profile.router";
import { authRouter } from "./router/auth";
import { bookingRouter } from "./router/booking.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  userProfile: userprofileRouter,
  booking: bookingRouter,
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
