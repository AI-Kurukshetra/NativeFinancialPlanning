import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModelingPageData } from "@/lib/server/app-data";

type ModelingStudioProps = {
  data: ModelingPageData;
};

function formatMetricValue(value: number | null, unit: string) {
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

function getVariant(status: string) {
  if (status === "active" || status === "favorable") {
    return "success" as const;
  }

  if (status === "unfavorable") {
    return "warning" as const;
  }

  return "secondary" as const;
}

export function ModelingStudio({ data }: ModelingStudioProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Chart of accounts</CardTitle>
            <CardDescription>
              Core financial structure available to planning and variance analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.accounts.length === 0 ? (
              <p className="text-sm text-slate-500">No accounts defined yet.</p>
            ) : (
              data.accounts.map((account) => (
                <div className="rounded-[22px] bg-white/70 p-4" key={account.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">
                        {account.code} · {account.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{account.category}</p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(account.updatedAt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost center ownership</CardTitle>
            <CardDescription>
              Teams, owners, and regional responsibility split in the active workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {data.costCenters.length === 0 ? (
              <p className="text-sm text-slate-500">No cost centers defined yet.</p>
            ) : (
              data.costCenters.map((costCenter) => (
                <div className="rounded-[24px] bg-white/75 p-4" key={costCenter.id}>
                  <p className="font-medium text-slate-950">
                    {costCenter.code} · {costCenter.name}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{costCenter.region}</p>
                  <p className="mt-1 text-sm text-slate-600">Owner {costCenter.owner}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <CardHeader>
            <CardTitle>Dimensions</CardTitle>
            <CardDescription>
              Analytical drill paths attached to planning, reporting, and scenarios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.dimensions.length === 0 ? (
              <p className="text-sm text-slate-500">No dimensions set up yet.</p>
            ) : (
              data.dimensions.map((dimension) => (
                <div className="rounded-[24px] bg-white/70 p-4" key={dimension.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{dimension.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                        {dimension.key}
                      </p>
                    </div>
                    <Badge variant="secondary">{dimension.values.length} values</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {dimension.values.map((value) => (
                      <Badge key={`${dimension.id}-${value}`} variant="outline">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scenario studio</CardTitle>
            <CardDescription>
              Testing layers and driver assumptions linked to forecasts and models.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.scenarios.length === 0 ? (
              <p className="text-sm text-slate-500">No scenarios defined yet.</p>
            ) : (
              data.scenarios.map((scenario) => (
                <div className="rounded-[24px] bg-white/75 p-4" key={scenario.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{scenario.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {scenario.forecastName ?? "No forecast"}
                        {scenario.workbookName ? ` · ${scenario.workbookName}` : ""}
                      </p>
                    </div>
                    <Badge variant={getVariant(scenario.status)}>{scenario.status}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {scenario.drivers.map((driver) => (
                      <Badge key={`${scenario.id}-${driver.key}`} variant="secondary">
                        {driver.key}: {driver.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tracked metrics</CardTitle>
            <CardDescription>
              The KPIs feeding dashboards, reports, and operating reviews.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.metrics.length === 0 ? (
              <p className="text-sm text-slate-500">No metrics defined yet.</p>
            ) : (
              data.metrics.map((metric) => (
                <div className="rounded-[22px] bg-white/70 p-4" key={metric.id}>
                  <div className="flex items-center justify-between gap-3">
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
                  <p className="mt-3 text-lg font-semibold text-slate-950">
                    {formatMetricValue(metric.actualValue, metric.unit)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variance register</CardTitle>
            <CardDescription>
              Stored variance records that can feed report packs and approvals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.variances.length === 0 ? (
              <p className="text-sm text-slate-500">No variance records defined yet.</p>
            ) : (
              data.variances.map((variance) => (
                <div className="rounded-[24px] bg-white/75 p-4" key={variance.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{variance.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {variance.periodLabel}
                        {variance.accountName ? ` · ${variance.accountName}` : ""}
                        {variance.costCenterName ? ` · ${variance.costCenterName}` : ""}
                      </p>
                    </div>
                    <Badge variant={getVariant(variance.status)}>{variance.status}</Badge>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Plan</p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {formatMetricValue(variance.planValue, "currency")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Actual</p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {formatMetricValue(variance.actualValue, "currency")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Delta</p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {formatMetricValue(variance.varianceValue, "currency")}
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
    </div>
  );
}
