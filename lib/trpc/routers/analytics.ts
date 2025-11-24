import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { AnalyticsResponse } from "@/lib/types";
import { publicProcedure, createTRPCRouter } from "../trpc";

const analyticsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  stores: z.array(z.string()).optional(),
});

export const analyticsRouter = createTRPCRouter({
  overview: publicProcedure
    .input(analyticsQuerySchema)
    .query(async ({ input }) => {
      const baseUrl = process.env.DATA_SERVICE_BASE_URL;
      if (!baseUrl) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DATA_SERVICE_BASE_URL is not configured" });
      }

      const search = new URLSearchParams();
      if (input.from) search.set("from", input.from);
      if (input.to) search.set("to", input.to);
      input.stores?.forEach((store) => search.append("stores", store));

      const url = `${baseUrl.replace(/\/$/, "")}/api/analytics/sales/overview?${search.toString()}`;

      const res = await fetch(url, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: `Data service error: ${res.status} ${text}`.trim(),
        });
      }

      const data = (await res.json()) as AnalyticsResponse;
      return data;
    }),
});
