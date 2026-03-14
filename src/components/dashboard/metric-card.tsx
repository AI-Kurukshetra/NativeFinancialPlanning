import type { DashboardMetric } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  const isPositive = metric.change > 0;
  const isNegative = metric.change < 0;
  const isNeutral = !isPositive && !isNegative && (!metric.emphasis || metric.emphasis === "neutral");

  return (
    <Card hover>
      <CardHeader className="pb-3">
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-3xl">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
            (metric.emphasis === "warning" || isNegative) &&
              "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/12 dark:text-red-300",
            (metric.emphasis === "positive" || isPositive) &&
              "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/12 dark:text-emerald-300",
            isNeutral &&
              "border-black/10 bg-black/4 text-neutral-700 dark:border-white/10 dark:bg-white/8 dark:text-neutral-300",
          )}
        >
          {metric.change > 0 ? "+" : ""}
          {metric.change}% vs prior cycle
        </div>
      </CardContent>
    </Card>
  );
}
