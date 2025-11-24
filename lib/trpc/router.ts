import { createTRPCRouter } from "./trpc";
import { analyticsRouter } from "./routers/analytics";

export const appRouter = createTRPCRouter({
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
