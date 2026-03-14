import { AppTopbar } from "@/components/shell/app-topbar";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardPageData } from "@/lib/server/app-data";

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

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function getVarianceVariant(status: string) {
  if (status === "favorable") {
    return "success" as const;
  }

  if (status === "unfavorable") {
    return "warning" as const;
  }

  return "secondary" as const;
}

export default async function DashboardPage() {
  const data = await getDashboardPageData();
  const context = data.context;
  const organizationName = context.organization?.name ?? "Workspace setup";
  const roleLabel = context.membership?.role ?? "member";
  const workbookStatuses = Object.entries(data.workbookStatusBreakdown);
  const reportStatuses = Object.entries(data.reportStatusBreakdown);
  const workflowStatuses = Object.entries(data.workflowStatusBreakdown);
  const maxWorkbookStatus = Math.max(...workbookStatuses.map(([, count]) => count), 1);
  const maxReportStatus = Math.max(...reportStatuses.map(([, count]) => count), 1);
  const maxWorkflowStatus = Math.max(...workflowStatuses.map(([, count]) => count), 1);

  return (
    <div className="space-y-6">
      <AppTopbar
        organizationName={organizationName}
        roleLabel={roleLabel}
        subtitle="Live planning health across workbooks, scenarios, KPIs, and approvals"
        title="Dashboard"
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      {!context.organization ? (
        <Card>
          <CardHeader>
            <CardTitle>Workspace setup incomplete</CardTitle>
            <CardDescription>
              Your session is active, but no default organization was found for this account yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Apply the Supabase onboarding migration, then sign up again or repair the missing
            membership row for this user.
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.95),rgba(15,23,42,0.88),rgba(30,41,59,0.92))] text-white">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl space-y-2">
                <CardTitle className="text-white">Finance command center</CardTitle>
                <CardDescription className="text-white/70">
                  Track operational pressure, planning structure, and scenario readiness without
                  leaving the active workspace.
                </CardDescription>
              </div>
              <Badge className="border-white/20 bg-white/10 text-white" variant="outline">
                {data.scenarioSummary.active} active scenarios
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[26px] border border-white/10 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">Scenario Coverage</p>
                <p className="mt-3 text-3xl font-semibold">{data.scenarioSummary.total}</p>
                <p className="mt-2 text-sm text-white/70">
                  {data.scenarioSummary.linkedForecasts} linked forecast programs
                </p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">Model Structure</p>
                <p className="mt-3 text-3xl font-semibold">
                  {data.modelCoverage.accounts + data.modelCoverage.costCenters}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Accounts and cost centers ready for analysis
                </p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">Report Readiness</p>
                <p className="mt-3 text-3xl font-semibold">
                  {data.planningCounts.reports}/{data.planningCounts.workflows}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Reports and workflow lanes populated this cycle
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Accounts", data.modelCoverage.accounts],
                ["Cost Centers", data.modelCoverage.costCenters],
                ["Dimensions", data.modelCoverage.dimensions],
                ["Exchange Rates", data.modelCoverage.exchangeRates],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4" key={label as string}>
                  <p className="text-sm text-white/65">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Execution radar</CardTitle>
            <CardDescription>
              Immediate workload and review pressure in the active planning cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Pending approvals", data.pendingApprovals, "Decision queue", "bg-amber-500"],
              ["Open comments", data.openComments, "Model review backlog", "bg-sky-500"],
              ["Unread notifications", data.unreadNotifications, "Personal inbox", "bg-emerald-500"],
              ["Snapshots", data.planningCounts.versions, "Recovery points", "bg-slate-900"],
            ].map(([label, value, meta, color]) => (
              <div className="rounded-[24px] bg-white/70 p-4" key={label as string}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-950">{label}</p>
                    <p className="text-sm text-slate-500">{meta}</p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-950">{value}</p>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${color}`}
                    style={{
                      width: `${Math.min(Number(value) * 18 + (Number(value) > 0 ? 20 : 0), 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>KPI performance board</CardTitle>
            <CardDescription>
              Target vs actual highlights pulled from the live metrics layer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.metricHighlights.length === 0 ? (
              <p className="text-sm text-slate-500">No KPI metrics are available yet.</p>
            ) : (
              data.metricHighlights.map((metric) => {
                const variance =
                  metric.targetValue && metric.actualValue
                    ? Math.max((metric.actualValue / metric.targetValue) * 100, 0)
                    : 0;

                return (
                  <div className="rounded-[24px] bg-white/70 p-4" key={metric.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">{metric.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Target {formatMetricValue(metric.targetValue, metric.unit)}
                        </p>
                      </div>
                      <Badge
                        variant={(metric.changePct ?? 0) >= 0 ? "success" : "warning"}
                      >
                        {metric.changePct !== null ? `${metric.changePct > 0 ? "+" : ""}${metric.changePct.toFixed(1)}%` : "Flat"}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>Actual {formatMetricValue(metric.actualValue, metric.unit)}</span>
                        <span>{Math.min(variance, 160).toFixed(0)}% of target</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-slate-900"
                          style={{ width: `${Math.min(variance, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variance watchlist</CardTitle>
            <CardDescription>
              Most recent financial gaps that need explanation, mitigation, or escalation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.varianceHighlights.length === 0 ? (
              <p className="text-sm text-slate-500">No variances logged yet.</p>
            ) : (
              data.varianceHighlights.map((variance) => (
                <div className="rounded-[24px] bg-white/70 p-4" key={variance.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{variance.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{variance.periodLabel}</p>
                    </div>
                    <Badge variant={getVarianceVariant(variance.status)}>
                      {variance.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-2xl font-semibold text-slate-950">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(variance.varianceValue)}
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

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Status lanes</CardTitle>
            <CardDescription>
              Distribution across workbook, report, and workflow states.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-800">Workbooks</p>
              {workbookStatuses.map(([status, count]) => (
                <div className="space-y-2" key={status}>
                  <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                    <span>{status.replaceAll("_", " ")}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-slate-900"
                      style={{ width: `${(count / maxWorkbookStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-800">Reports</p>
              {reportStatuses.map(([status, count]) => (
                <div className="space-y-2" key={status}>
                  <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                    <span>{status.replaceAll("_", " ")}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-sky-500"
                      style={{ width: `${(count / maxReportStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-800">Workflows</p>
              {workflowStatuses.map(([status, count]) => (
                <div className="space-y-2" key={status}>
                  <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                    <span>{status.replaceAll("_", " ")}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${(count / maxWorkflowStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current priorities</CardTitle>
            <CardDescription>
              Workbooks and notifications most relevant for the current testing pass.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {data.workbooks.length === 0 ? (
                <p className="text-sm text-slate-500">Create a workbook to populate the dashboard.</p>
              ) : (
                data.workbooks.map((workbook) => (
                  <div className="rounded-[24px] bg-white/70 p-4" key={workbook.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">{workbook.name}</p>
                      <Badge
                        variant={
                          workbook.status === "published"
                            ? "success"
                            : workbook.status === "in_review"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {workbook.status.replaceAll("_", " ")}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{workbook.description}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Owner {workbook.owner} · {workbook.collaborators} collaborators
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Latest inbox items</p>
              <div className="mt-3 space-y-3">
                {data.latestNotifications.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No notifications yet. Workflow and review events will show up here.
                  </p>
                ) : (
                  data.latestNotifications.map((notification) => (
                    <div className="rounded-2xl bg-white px-4 py-3" key={notification.id}>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-slate-950">{notification.title}</p>
                        <Badge variant={notification.readAt ? "secondary" : "gradient"}>
                          {notification.kind}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {notification.body || "No details provided."}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent backend activity</CardTitle>
          <CardDescription>Audit trail events generated by the live API layer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentAuditEvents.length === 0 ? (
            <p className="text-sm text-slate-500">
              No audit events yet. Mutating actions will appear here once the UI is used.
            </p>
          ) : (
            data.recentAuditEvents.map((event) => (
              <div className="rounded-[24px] bg-white/70 p-4" key={event.id}>
                <p className="font-medium text-slate-950">{event.action.replaceAll("_", " ")}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {event.entityType} · {new Date(event.createdAt).toLocaleString("en-US")}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
