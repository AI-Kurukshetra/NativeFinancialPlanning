"use client";

import { CalendarClock, Download, FileOutput, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ReportPageItem, SchedulePageItem } from "@/lib/server/app-data";

type ReportingStudioProps = {
  reports: ReportPageItem[];
  schedules: SchedulePageItem[];
};

function getReportVariant(status: string) {
  if (status === "published") {
    return "success" as const;
  }

  if (status === "generated") {
    return "gradient" as const;
  }

  if (status === "archived") {
    return "outline" as const;
  }

  return "secondary" as const;
}

function getDefinitionSections(definition: Record<string, unknown>) {
  const sections = definition.sections;

  if (!Array.isArray(sections)) {
    return [];
  }

  return sections.map((section) => String(section));
}

export function ReportingStudio({ reports, schedules }: ReportingStudioProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleReportId, setScheduleReportId] = useState("");
  const [scheduleCron, setScheduleCron] = useState("0 8 * * 1");
  const [scheduleTimezone, setScheduleTimezone] = useState("Asia/Kolkata");
  const publishedReports = reports.filter((report) => report.status === "published").length;
  const generatedReports = reports.filter((report) => report.status === "generated").length;
  const activeSchedules = schedules.filter((schedule) => schedule.status === "active").length;

  function updateReport(
    id: string,
    payload: Record<string, unknown>,
    successMessage: string,
  ) {
    startTransition(async () => {
      const response = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to update report.");
        return;
      }

      toast.success(successMessage);
      router.refresh();
    });
  }

  function deleteReport(id: string) {
    startTransition(async () => {
      const response = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to delete report.");
        return;
      }

      toast.success("Report deleted.");
      router.refresh();
    });
  }

  function exportWorkbook(workbookId: string, format: "json" | "csv") {
    startTransition(async () => {
      const response = await fetch("/api/exports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workbookId, format }),
      });
      const result = (await response.json()) as {
        data?: { files: Array<{ filename: string; content: string; mimeType: string }> };
        error?: string;
      };

      if (!response.ok || !result.data) {
        toast.error(result.error ?? "Failed to export linked workbook.");
        return;
      }

      for (const file of result.data.files) {
        const blob = new Blob([file.content], { type: file.mimeType });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = file.filename;
        anchor.click();
        URL.revokeObjectURL(url);
      }

      toast.success(`Exported ${result.data.files.length} file(s).`);
    });
  }

  function createSchedule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: scheduleName,
          reportId: scheduleReportId || undefined,
          cronExpression: scheduleCron,
          timezone: scheduleTimezone,
          status: "active",
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to create schedule.");
        return;
      }

      toast.success("Schedule created.");
      setScheduleName("");
      setScheduleReportId("");
      setScheduleCron("0 8 * * 1");
      setScheduleTimezone("Asia/Kolkata");
      router.refresh();
    });
  }

  function updateSchedule(id: string, status: string) {
    startTransition(async () => {
      const response = await fetch(`/api/schedules/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to update schedule.");
        return;
      }

      toast.success("Schedule updated.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Published", publishedReports, "Board-ready outputs"],
          ["Generated", generatedReports, "Awaiting final review"],
          ["Active schedules", activeSchedules, "Distribution streams"],
        ].map(([label, value, meta]) => (
          <div className="rounded-[26px] border border-white/55 bg-white/75 p-5" key={label as string}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{meta}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report library</CardTitle>
          <CardDescription>
            Control publish state, workbook export, and reporting readiness from a
            single queue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-sm text-slate-500">No reports created yet.</p>
          ) : (
            reports.map((report) => (
              <div className="rounded-[28px] border border-white/55 bg-white/75 p-5" key={report.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-950">{report.name}</p>
                      <Badge variant={getReportVariant(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {report.generatedAt
                        ? `Generated ${new Date(report.generatedAt).toLocaleString("en-US")}`
                        : "Definition saved, not generated yet"}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Layout {(report.definition.layout as string | undefined) ?? "custom"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getDefinitionSections(report.definition).length === 0 ? (
                        <Badge variant="outline">No sections configured</Badge>
                      ) : (
                        getDefinitionSections(report.definition).map((section) => (
                          <Badge key={`${report.id}-${section}`} variant="secondary">
                            {section}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  <Button
                    leftIcon={<Trash2 className="size-4" />}
                    loading={isPending}
                    onClick={() => deleteReport(report.id)}
                    size="sm"
                    variant="ghost"
                  >
                    Delete
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    leftIcon={<FileOutput className="size-4" />}
                    loading={isPending}
                    onClick={() =>
                      updateReport(report.id, { status: "generated" }, "Report marked as generated.")
                    }
                    size="sm"
                    variant="secondary"
                  >
                    Generate
                  </Button>
                  <Button
                    loading={isPending}
                    onClick={() =>
                      updateReport(report.id, { status: "published" }, "Report published.")
                    }
                    size="sm"
                    variant="outline"
                  >
                    Publish
                  </Button>
                  <Button
                    loading={isPending}
                    onClick={() =>
                      updateReport(report.id, { status: "draft", generatedAt: null }, "Report returned to draft.")
                    }
                    size="sm"
                    variant="ghost"
                  >
                    Reset to draft
                  </Button>
                  <Button
                    disabled={!report.workbookId}
                    leftIcon={<Download className="size-4" />}
                    loading={isPending}
                    onClick={() => report.workbookId && exportWorkbook(report.workbookId, "json")}
                    size="sm"
                    variant="secondary"
                  >
                    Export JSON
                  </Button>
                  <Button
                    disabled={!report.workbookId}
                    leftIcon={<Download className="size-4" />}
                    loading={isPending}
                    onClick={() => report.workbookId && exportWorkbook(report.workbookId, "csv")}
                    size="sm"
                    variant="secondary"
                  >
                    Export CSV
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Schedule distribution</CardTitle>
            <CardDescription>
              Link report definitions to repeatable runs without waiting for the
              roadmap automation layer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={createSchedule}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800" htmlFor="schedule-name">
                  Schedule name
                </label>
                <Input
                  id="schedule-name"
                  onChange={(event) => setScheduleName(event.target.value)}
                  placeholder="Monday exec pack"
                  value={scheduleName}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800" htmlFor="schedule-report">
                  Report
                </label>
                <select
                  className="flex h-11 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  id="schedule-report"
                  onChange={(event) => setScheduleReportId(event.target.value)}
                  value={scheduleReportId}
                >
                  <option value="">Select report</option>
                  {reports.map((report) => (
                    <option key={report.id} value={report.id}>
                      {report.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800" htmlFor="schedule-cron">
                  Cron expression
                </label>
                <Input
                  id="schedule-cron"
                  onChange={(event) => setScheduleCron(event.target.value)}
                  placeholder="0 8 * * 1"
                  value={scheduleCron}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800" htmlFor="schedule-timezone">
                  Timezone
                </label>
                <Input
                  id="schedule-timezone"
                  onChange={(event) => setScheduleTimezone(event.target.value)}
                  placeholder="Asia/Kolkata"
                  value={scheduleTimezone}
                />
              </div>

              <Button
                className="w-full"
                loading={isPending}
                type="submit"
              >
                Create schedule
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution queue</CardTitle>
            <CardDescription>
              Review active schedules, next runs, and paused reporting streams.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {schedules.length === 0 ? (
              <p className="text-sm text-slate-500">No schedules created yet.</p>
            ) : (
              schedules.map((schedule) => (
                <div className="rounded-2xl bg-white/75 p-4" key={schedule.id}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-950">{schedule.name}</p>
                        <Badge variant={schedule.status === "active" ? "success" : "secondary"}>
                          {schedule.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {schedule.reportName ?? "Unlinked schedule"} · {schedule.cronExpression}
                      </p>
                      <p className="text-xs text-slate-500">
                        {schedule.nextRunAt
                          ? `Next run ${new Date(schedule.nextRunAt).toLocaleString("en-US")}`
                          : "No next run calculated yet"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        leftIcon={<CalendarClock className="size-4" />}
                        loading={isPending}
                        onClick={() =>
                          updateSchedule(
                            schedule.id,
                            schedule.status === "active" ? "paused" : "active",
                          )
                        }
                        size="sm"
                        variant="secondary"
                      >
                        {schedule.status === "active" ? "Pause" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
