import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  FileSpreadsheet,
  Layers3,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BudgetPageItem, ForecastPageItem, PlanningDetailPageData } from "@/lib/server/app-data";

type PlanningDetailViewProps = {
  data: PlanningDetailPageData;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

function getVariant(status: string) {
  if (status === "active" || status === "published" || status === "favorable") {
    return "success" as const;
  }

  if (
    status === "locked" ||
    status === "pending_approval" ||
    status === "generated" ||
    status === "unfavorable"
  ) {
    return "warning" as const;
  }

  if (status === "archived") {
    return "outline" as const;
  }

  return "secondary" as const;
}

export function PlanningDetailView({ data }: PlanningDetailViewProps) {
  const workbookSheets = data.workbook?.worksheets.length ?? 0;
  const workbookCells =
    data.workbook?.worksheets.reduce((sum, worksheet) => sum + worksheet.cells.length, 0) ?? 0;
  const openComments = data.workbook?.comments.filter((comment) => !comment.resolved_at).length ?? 0;
  const latestVariance = data.variances[0] ?? null;
  const topMetrics = data.metrics.slice(0, 4);
  const featuredScenarios = data.scenarios.slice(0, 4);
  const isBudget = data.kind === "budget";
  const budgetItem = isBudget
    ? (data.item as BudgetPageItem & {
        ownerName: string | null;
        workbookName: string | null;
        workbookDescription: string | null;
        workbookStatus: string | null;
      })
    : null;
  const forecastItem = !isBudget
    ? (data.item as ForecastPageItem & {
        ownerName: string | null;
        workbookName: string | null;
        workbookDescription: string | null;
        workbookStatus: string | null;
      })
    : null;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-black/8 bg-[linear-gradient(135deg,rgba(255,248,240,0.96),rgba(245,248,252,0.94),rgba(232,240,246,0.92))]">
        <div className="grid gap-6 p-6 xl:grid-cols-[1.02fr_0.98fr] xl:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getVariant(data.item.status)}>{data.item.status}</Badge>
              <Badge variant="outline">{isBudget ? "Budget lane" : "Forecast lane"}</Badge>
              {data.item.workbookName ? (
                <Badge variant="secondary">{data.item.workbookName}</Badge>
              ) : null}
            </div>

            <div className="space-y-3">
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
                {data.item.name}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                {data.item.workbookDescription ??
                  `Connected planning surface for ${isBudget ? "budget ownership, variance review, and review timing" : "forecast confidence, scenario movement, and operating coverage"}.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild leftIcon={<ArrowRight className="size-4" />} variant="secondary">
                <Link href={isBudget ? "/budgets" : "/forecasts"}>
                  Back to {isBudget ? "budgets" : "forecasts"}
                </Link>
              </Button>
              {data.item.workbookId ? (
                <Button asChild leftIcon={<FileSpreadsheet className="size-4" />} variant="outline">
                  <Link href={`/workbooks/${data.item.workbookId}`}>Open linked workbook</Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[26px] border border-black/8 bg-white/82 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Owner</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                {data.item.ownerName ?? "Unassigned"}
              </p>
            </div>
            <div className="rounded-[26px] border border-black/8 bg-white/82 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Planning frame</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                {isBudget
                  ? `${formatDate(budgetItem?.startsOn ?? null)} to ${formatDate(budgetItem?.endsOn ?? null)}`
                  : forecastItem?.horizonMonths
                    ? `${forecastItem.horizonMonths} month horizon`
                    : "No horizon set"}
              </p>
            </div>
            <div className="rounded-[26px] border border-black/8 bg-white/82 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Model depth</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                {workbookSheets} sheets · {workbookCells} cells
              </p>
            </div>
            <div className="rounded-[26px] border border-black/8 bg-white/82 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Execution watch</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                {data.scenarios.length} scenarios · {openComments} open comments
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <Card>
          <CardHeader>
            <CardTitle>Planning lane</CardTitle>
            <CardDescription>
              Linked workbook context, timing, and the current operating footprint.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50/90 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarRange className="size-4" />
                  <p className="text-xs uppercase tracking-[0.2em]">Timeline</p>
                </div>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {isBudget
                    ? `${formatDate(budgetItem?.startsOn ?? null)} to ${formatDate(budgetItem?.endsOn ?? null)}`
                    : forecastItem?.horizonMonths
                      ? `${forecastItem.horizonMonths} month planning window`
                      : "Forecast window pending"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Updated {new Date(data.item.updatedAt).toLocaleString("en-US")}
                </p>
              </div>

              <div className="rounded-[24px] bg-slate-50/90 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Layers3 className="size-4" />
                  <p className="text-xs uppercase tracking-[0.2em]">Workbook status</p>
                </div>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {data.item.workbookStatus?.replaceAll("_", " ") ?? "No workbook linked"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {data.item.workbookName ?? "Attach a workbook to deepen model visibility."}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] bg-[linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,0.96),rgba(51,65,85,0.92))] p-5 text-white">
              <div className="flex items-center gap-2 text-white/70">
                <Sparkles className="size-4" />
                <p className="text-xs uppercase tracking-[0.2em]">Operator summary</p>
              </div>
              <p className="mt-4 text-2xl font-semibold">
                {data.item.ownerName ?? "No owner"} is steering this{" "}
                {isBudget ? "budget cycle" : "forecast cycle"}.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
                This surface now combines workbook structure, KPI coverage, scenario movement, and
                variance pressure so the planning object feels like a real operating lane rather
                than a single record.
              </p>
            </div>

            <div className="rounded-[24px] bg-slate-50/90 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workbook footprint</p>
              {data.workbook ? (
                <div className="mt-3 space-y-3">
                  {data.workbook.worksheets.map((worksheet) => (
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3"
                      key={worksheet.id}
                    >
                      <div>
                        <p className="font-medium text-slate-950">{worksheet.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {worksheet.cells.length} cells · updated{" "}
                          {new Date(worksheet.updated_at).toLocaleDateString("en-US")}
                        </p>
                      </div>
                      <Badge variant="outline">Sheet {worksheet.position + 1}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No workbook is linked to this planning lane yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-slate-950 text-white">
          <CardHeader>
            <CardTitle className="text-white">Scenario studio</CardTitle>
            <CardDescription className="text-white/70">
              Assumption lanes and what-if movement tied to this planning object.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
              {featuredScenarios.length === 0 ? (
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 text-sm text-white/72">
                  No scenarios are linked yet. Create scenario tracks to compare operator cases.
                </div>
              ) : (
                featuredScenarios.map((scenario) => (
                  <div className="rounded-[24px] border border-white/10 bg-white/8 p-4" key={scenario.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{scenario.name}</p>
                      <Badge variant={getVariant(scenario.status)}>{scenario.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-white/65">
                      {scenario.forecastName ?? scenario.workbookName ?? "Detached scenario lane"}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {scenario.drivers.length === 0 ? (
                        <Badge variant="outline">No drivers</Badge>
                      ) : (
                        scenario.drivers.slice(0, 3).map((driver) => (
                          <Badge key={`${scenario.id}-${driver.key}`} variant="outline">
                            {driver.key}: {driver.value}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/8 p-5">
              <div className="mb-4 flex items-center gap-2 text-white/70">
                <TrendingUp className="size-4" />
                <p className="text-sm font-medium text-white">Variance spotlight</p>
              </div>
              {latestVariance ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[22px] bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55">Variance</p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {formatValue(latestVariance.varianceValue, "currency")}
                    </p>
                    <p className="mt-2 text-sm text-white/65">{latestVariance.name}</p>
                  </div>
                  <div className="rounded-[22px] bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55">Period</p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {latestVariance.periodLabel}
                    </p>
                    <p className="mt-2 text-sm text-white/65">
                      {latestVariance.costCenterName ?? "Cross-functional coverage"}
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55">Status</p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {latestVariance.status.replaceAll("_", " ")}
                    </p>
                    <p className="mt-2 text-sm text-white/65">
                      {latestVariance.variancePercent !== null
                        ? `${latestVariance.variancePercent.toFixed(1)}% spread`
                        : "Percent spread pending"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/72">
                  Variance tracking will appear here once operational results start landing against
                  the plan.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <Card>
          <CardHeader>
            <CardTitle>KPI coverage</CardTitle>
            <CardDescription>Current metrics connected to this planning surface.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topMetrics.length === 0 ? (
              <p className="text-sm text-slate-500">No metrics are linked yet.</p>
            ) : (
              topMetrics.map((metric) => (
                <div className="rounded-[24px] bg-white/75 p-4" key={metric.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{metric.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {metric.workbookName ?? "No workbook context"}
                      </p>
                    </div>
                    <Badge variant="outline">{metric.unit}</Badge>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Actual</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {formatValue(metric.actualValue, metric.unit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Target</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {formatValue(metric.targetValue, metric.unit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Change</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {metric.changePct !== null ? `${metric.changePct.toFixed(1)}%` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variance register</CardTitle>
            <CardDescription>
              The latest operating gaps currently linked to this plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.variances.length === 0 ? (
              <p className="text-sm text-slate-500">No variances tracked yet.</p>
            ) : (
              data.variances.map((variance) => (
                <div className="rounded-[24px] bg-slate-50/90 p-4" key={variance.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{variance.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {variance.periodLabel} · {variance.accountName ?? "No account"} ·{" "}
                        {variance.costCenterName ?? "No cost center"}
                      </p>
                    </div>
                    <Badge variant={getVariant(variance.status)}>{variance.status}</Badge>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Plan</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {formatValue(variance.planValue, "currency")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Actual</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {formatValue(variance.actualValue, "currency")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Delta</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {formatValue(variance.varianceValue, "currency")}
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
