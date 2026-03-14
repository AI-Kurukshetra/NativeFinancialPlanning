import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-slate-800", className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[28px] border border-white/55 bg-white/60 p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="size-12 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-16 w-48 rounded-full" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-14 w-full max-w-2xl" />
        <Skeleton className="h-6 w-full max-w-xl" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-12 w-40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-[28px]" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonFeatureGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
