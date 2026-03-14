import type { DashboardMetric } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-3xl">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-xs font-medium",
            metric.emphasis === "warning" && "bg-amber-100 text-amber-800",
            metric.emphasis === "positive" && "bg-emerald-100 text-emerald-800",
            (!metric.emphasis || metric.emphasis === "neutral") && "bg-slate-100 text-slate-700",
          )}
        >
          {metric.change > 0 ? "+" : ""}
          {metric.change}% vs prior cycle
        </div>
      </CardContent>
    </Card>
  );
}

