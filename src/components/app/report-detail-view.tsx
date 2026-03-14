import Link from "next/link";
import { CalendarClock, Download, FileText, RefreshCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReportDetailPageData } from "@/lib/server/app-data";

type ReportDetailViewProps = {
  data: ReportDetailPageData;
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

function getSections(definition: Record<string, unknown>) {
  const sections = definition.sections;

  if (!Array.isArray(sections)) {
    return [];
  }

  return sections.map((section) => String(section));
}

function getVariant(status: string) {
  if (status === "published" || status === "active" || status === "favorable") {
    return "success" as const;
  }

  if (status === "generated" || status === "unfavorable") {
    return "warning" as const;
  }

  return "secondary" as const;
}

export function ReportDetailView({ data }: ReportDetailViewProps) {
  const reportSections = getSections(data.report.definition);
  const workbookCells =
    data.workbook?.worksheets.reduce((sum, worksheet) => sum + worksheet.cells.length, 0) ?? 0;
  const workbookSheets = data.workbook?.worksheets.length ?? 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-black/8 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(245,247,250,0.96),rgba(234,239,245,0.92))]">
        <div className="grid gap-6 p-6 xl:grid-cols-[1.05fr_0.95fr] xl:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getVariant(data.report.status)}>{data.report.status}</Badge>
              <Badge variant="outline">
                {(data.report.definition.layout as string | undefined) ?? "custom layout"}
              </Badge>
            </div>
            <div className="space-y-3">
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
                {data.report.name}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                {data.report.workbookDescription ??
                  "Financial reporting surface linked to the active planning model."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild leftIcon={<Download className="size-4" />} variant="secondary">
                <Link href="/reports">Back to reports</Link>
              </Button>
              {data.report.workbookId ? (
                <Button asChild leftIcon={<FileText className="size-4" />} variant="outline">
                  <Link href={`/workbooks/${data.report.workbookId}`}>Open linked workbook</Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[26px] border border-black/8 bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Generated</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                {data.report.generatedAt
                  ? new Date(data.report.generatedAt).toLocaleString("en-US")
                  : "Not generated yet"}
              </p>
            </div>
            <div className="rounded-[26px] border border-black/8 bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Distribution</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                {data.schedules.length} active schedule lane(s)
              </p>
            </div>
            <div className="rounded-[26px] border border-black/8 bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Workbook depth</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                {workbookSheets} sheets · {workbookCells} cells
              </p>
            </div>
            <div className="rounded-[26px] border border-black/8 bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Coverage</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                {data.metrics.length} KPI cards · {data.variances.length} variance items
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <CardHeader>
            <CardTitle>Report architecture</CardTitle>
            <CardDescription>
              Layout, sections, linked workbook context, and publication readiness.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] bg-slate-50/90 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Linked workbook</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {data.report.workbookName ?? "No workbook linked"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {data.report.workbookStatus
                  ? `Workbook status ${data.report.workbookStatus.replaceAll("_", " ")}`
                  : "Attach a workbook to deepen preview coverage."}
              </p>
            </div>

            <div className="rounded-[24px] bg-slate-50/90 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sections</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {reportSections.length === 0 ? (
                  <Badge variant="outline">No sections configured</Badge>
                ) : (
                  reportSections.map((section) => (
                    <Badge key={section} variant="secondary">
                      {section}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[24px] bg-slate-50/90 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Schedules</p>
              <div className="mt-3 space-y-3">
                {data.schedules.length === 0 ? (
                  <p className="text-sm text-slate-500">No schedules attached to this report.</p>
                ) : (
                  data.schedules.map((schedule) => (
                    <div className="rounded-2xl bg-white px-4 py-3" key={schedule.id}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-950">{schedule.name}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {schedule.cronExpression} · {schedule.timezone}
                          </p>
                        </div>
                        <Badge variant={getVariant(schedule.status)}>{schedule.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-slate-950 text-white">
          <CardHeader>
            <CardTitle className="text-white">Board pack preview</CardTitle>
            <CardDescription className="text-white/70">
              A richer report-facing presentation layer built on top of the linked model.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.metrics.length === 0 ? (
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 text-sm text-white/70">
                  No metrics are linked to this report yet.
                </div>
              ) : (
                data.metrics.slice(0, 3).map((metric) => (
                  <div className="rounded-[24px] border border-white/10 bg-white/8 p-4" key={metric.id}>
                    <p className="text-sm text-white/65">{metric.name}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {formatValue(metric.actualValue, metric.unit)}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/55">
                      Target {formatValue(metric.targetValue, metric.unit)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/8 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">Narrative sections</p>
                  <p className="mt-1 text-sm text-white/65">
                    Structured sections pulled from the report definition.
                  </p>
                </div>
                <RefreshCcw className="size-4 text-white/60" />
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {(reportSections.length > 0 ? reportSections : ["Executive Summary", "Drivers", "Actions"]).map((section) => (
                  <div className="rounded-[22px] bg-black/20 p-4" key={section}>
                    <p className="font-medium text-white">{section}</p>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      {section} is now ready for a richer visual builder with charts, narrative,
                      and KPI modules.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <Card>
          <CardHeader>
            <CardTitle>KPI snapshot</CardTitle>
            <CardDescription>
              Metrics currently available to the reporting layer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.metrics.length === 0 ? (
              <p className="text-sm text-slate-500">No KPI metrics available yet.</p>
            ) : (
              data.metrics.map((metric) => (
                <div className="rounded-[24px] bg-white/75 p-4" key={metric.id}>
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
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Actual</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">
                        {formatValue(metric.actualValue, metric.unit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Target</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">
                        {formatValue(metric.targetValue, metric.unit)}
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
            <CardTitle>Variance spotlight</CardTitle>
            <CardDescription>
              Latest gaps that should surface in a review pack.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.variances.length === 0 ? (
              <p className="text-sm text-slate-500">No variances available for this report.</p>
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
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p className="text-2xl font-semibold text-slate-950">
                      {formatValue(variance.varianceValue, "currency")}
                    </p>
                    <p className="text-sm text-slate-500">
                      {variance.variancePercent !== null
                        ? `${variance.variancePercent > 0 ? "+" : ""}${variance.variancePercent.toFixed(1)}%`
                        : "No % delta"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {data.workbook ? (
        <Card>
          <CardHeader>
            <CardTitle>Source workbook structure</CardTitle>
            <CardDescription>
              The report is currently backed by this workbook model.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {data.workbook.worksheets.map((worksheet) => (
              <div className="rounded-[24px] bg-white/75 p-4" key={worksheet.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-950">{worksheet.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {worksheet.cells.length} persisted cell{worksheet.cells.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <CalendarClock className="size-4 text-slate-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
