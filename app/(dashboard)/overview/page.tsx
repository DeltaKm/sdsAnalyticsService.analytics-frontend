import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { OverviewContent } from "./overview-content";

export const dynamic = "force-dynamic";

export default function OverviewPage() {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const demoFrom = process.env.NEXT_PUBLIC_DEMO_DEFAULT_FROM ?? "";
  const demoTo = process.env.NEXT_PUBLIC_DEMO_DEFAULT_TO ?? "";

  return (
    <Suspense fallback={<OverviewFallback />}>
      <OverviewContent 
        demoMode={demoMode}
        demoFrom={demoFrom}
        demoTo={demoTo}
      />
    </Suspense>
  );
}

function OverviewFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-48" />
      <OverviewLoading />
    </div>
  );
}

function OverviewLoading() {
  const barSkeletonHeights = [40, 55, 65, 48, 70, 52, 60, 45];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Caricamento dati in corso…</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/60 bg-muted p-4 shadow-sm"
          >
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-4 h-8 w-1/2" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/60 bg-muted p-4 shadow-sm space-y-4"
          >
            <Skeleton className="h-5 w-1/4" />
            <div className="flex h-56 items-end gap-2">
              {barSkeletonHeights.map((height, barIndex) => (
                <Skeleton
                  key={barIndex}
                  className="w-full flex-1 rounded-sm"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-2 w-20" />
              <Skeleton className="h-2 w-12" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-muted p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-1/5" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="divide-y divide-border/60 rounded-lg border border-border/60">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 px-4 py-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
