import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-300/60 dark:bg-slate-600/60",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
