import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsPageData } from "@/lib/server/app-data";

type AnalyticsOverviewProps = {
  data: AnalyticsPageData;
};

function formatValue(value: number | null, unit: string) {
  if (value === null) {
    return "N/A";
  }

  if (unit === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (unit === "percent") {
    return `${value.toFixed(1)}%`;
  }

  if (unit === "ratio") {
    return `${value.toFixed(1)}x`;
  }

  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function getStatusVariant(status: string) {
  if (status === "favorable" || status === "active") {
    return "success" as const;
  }

  if (status === "unfavorable") {
    return "warning" as const;
  }

  return "secondary" as const;
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
        {[
          ["Accounts", data.summary.accounts],
          ["Cost Centers", data.summary.costCenters],
          ["Dimensions", data.summary.dimensions],
          ["Metrics", data.summary.metrics],
          ["Variances", data.summary.variances],
          ["Scenarios", data.summary.scenarios],
        ].map(([label, value]) => (
          <Card key={label as string}>
            <CardHeader className="pb-3">
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-3xl">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>KPI scorecards</CardTitle>
            <CardDescription>
              Metrics with target comparison and current movement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.metrics.length === 0 ? (
              <p className="text-sm text-slate-500">No metrics tracked yet.</p>
            ) : (
              data.metrics.map((metric) => {
                const progress =
                  metric.actualValue !== null && metric.targetValue
                    ? Math.max((metric.actualValue / metric.targetValue) * 100, 0)
                    : 0;

                return (
                  <div className="rounded-[24px] bg-white/70 p-4" key={metric.id}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">{metric.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {metric.workbookName ?? "Unlinked metric"}
                        </p>
                      </div>
                      <Badge variant={(metric.changePct ?? 0) >= 0 ? "success" : "warning"}>
                        {metric.changePct !== null
                          ? `${metric.changePct > 0 ? "+" : ""}${metric.changePct.toFixed(1)}%`
                          : "Flat"}
                      </Badge>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Actual</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">
                          {formatValue(metric.actualValue, metric.unit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Target</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">
                          {formatValue(metric.targetValue, metric.unit)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-slate-900"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variance cockpit</CardTitle>
            <CardDescription>
              Current favorable and unfavorable deltas across the model.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.variances.length === 0 ? (
              <p className="text-sm text-slate-500">No variances captured yet.</p>
            ) : (
              data.variances.map((variance) => (
                <div className="rounded-[24px] bg-white/70 p-4" key={variance.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{variance.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {variance.periodLabel}
                        {variance.accountName ? ` · ${variance.accountName}` : ""}
                        {variance.costCenterName ? ` · ${variance.costCenterName}` : ""}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(variance.status)}>{variance.status}</Badge>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Plan</p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {formatValue(variance.planValue, "currency")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Actual</p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {formatValue(variance.actualValue, "currency")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Delta</p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {formatValue(variance.varianceValue, "currency")}
                        {variance.variancePercent !== null
                          ? ` · ${variance.variancePercent > 0 ? "+" : ""}${variance.variancePercent.toFixed(1)}%`
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
        <Card>
          <CardHeader>
            <CardTitle>Dimension coverage</CardTitle>
            <CardDescription>
              How much analytical dimensionality the workspace already has.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.dimensionCoverage.length === 0 ? (
              <p className="text-sm text-slate-500">No dimensions defined yet.</p>
            ) : (
              data.dimensionCoverage.map((dimension) => (
                <div className="rounded-[22px] bg-white/70 p-4" key={dimension.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{dimension.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                        {dimension.key}
                      </p>
                    </div>
                    <p className="text-2xl font-semibold text-slate-950">
                      {dimension.valuesCount}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scenario stack</CardTitle>
            <CardDescription>
              Named planning cases and the drivers attached to each one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.scenarios.length === 0 ? (
              <p className="text-sm text-slate-500">No scenarios are available yet.</p>
            ) : (
              data.scenarios.map((scenario) => (
                <div className="rounded-[24px] bg-white/70 p-4" key={scenario.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{scenario.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {scenario.forecastName ?? "No linked forecast"}
                        {scenario.workbookName ? ` · ${scenario.workbookName}` : ""}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(scenario.status)}>{scenario.status}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {scenario.drivers.length === 0 ? (
                      <p className="text-sm text-slate-500">No drivers captured.</p>
                    ) : (
                      scenario.drivers.map((driver) => (
                        <Badge key={`${scenario.id}-${driver.key}`} variant="secondary">
                          {driver.key}: {driver.value}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
