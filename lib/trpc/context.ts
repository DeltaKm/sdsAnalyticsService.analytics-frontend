import type { inferAsyncReturnType } from "@trpc/server";

export async function createTRPCContext({ req }: { req: Request }) {
  return { req };
}

export type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;
