"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BellRing,
  Clock3,
  FileSpreadsheet,
  GitBranchPlus,
  Layers3,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type MetricItem = {
  label: string;
  value: string;
  change: number;
  emphasis?: "positive" | "warning" | "neutral";
};

type WorkbookItem = {
  id: string;
  name: string;
  description: string;
  status: string;
  owner: string;
  updatedAt: string;
  collaborators: number;
};

type NotificationItem = {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
};

type AuditItem = {
  id: number;
  action: string;
  entityType: string;
  createdAt: string;
};

type MetricHighlight = {
  id: string;
  name: string;
  unit: string;
  actualValue: number | null;
  targetValue: number | null;
  changePct: number | null;
};

type VarianceHighlight = {
  id: string;
  name: string;
  periodLabel: string;
  varianceValue: number;
  variancePercent: number | null;
  status: string;
};

type DashboardCommandCenterProps = {
  latestNotifications: NotificationItem[];
  metricHighlights: MetricHighlight[];
  metrics: MetricItem[];
  modelCoverage: {
    accounts: number;
    costCenters: number;
    dimensions: number;
    exchangeRates: number;
  };
  openComments: number;
  pendingApprovals: number;
  planningCounts: {
    budgets: number;
    forecasts: number;
    reports: number;
    workflows: number;
    versions: number;
  };
  recentAuditEvents: AuditItem[];
  scenarioSummary: {
    total: number;
    active: number;
    linkedForecasts: number;
  };
  unreadNotifications: number;
  varianceHighlights: VarianceHighlight[];
  workbooks: WorkbookItem[];
  workflowStatusBreakdown: Record<string, number>;
};

type ChartMode = "planning" | "model" | "execution";

type ChartDatum = {
  detail: string;
  label: string;
  value: number;
};

type ChartModeMeta = {
  barSideClass: string;
  barTopClass: string;
  glowClass: string;
  railClass: string;
  surfaceClass: string;
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

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedPercent(value: number | null) {
  if (value === null) {
    return "N/A";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function getMetricRatio(actualValue: number | null, targetValue: number | null) {
  if (actualValue === null || targetValue === null || targetValue === 0) {
    return null;
  }

  return ((actualValue - targetValue) / Math.abs(targetValue)) * 100;
}

function getBadgeVariant(status: string) {
  if (status === "published" || status === "approved" || status === "favorable") {
    return "success" as const;
  }

  if (status === "pending_approval" || status === "unfavorable" || status === "in_review") {
    return "warning" as const;
  }

  return "secondary" as const;
}

function buildWaterfall(values: VarianceHighlight[]) {
  let runningTotal = 0;

  return values.map((item) => {
    const start = runningTotal;
    runningTotal += item.varianceValue;

    return {
      ...item,
      end: runningTotal,
      start,
    };
  });
}

const SOFT_PANEL_CLASS =
  "rounded-[26px] border border-black/8 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(241,245,249,0.94))] shadow-[0_20px_40px_rgba(15,23,42,0.05)]";

const FROST_PANEL_CLASS =
  "rounded-[28px] border border-white/14 bg-white/8 shadow-[0_20px_50px_rgba(15,23,42,0.14)] backdrop-blur-xl";

export function DashboardCommandCenter({
  latestNotifications,
  metricHighlights,
  metrics,
  modelCoverage,
  openComments,
  pendingApprovals,
  planningCounts,
  recentAuditEvents,
  scenarioSummary,
  unreadNotifications,
  varianceHighlights,
  workbooks,
  workflowStatusBreakdown,
}: DashboardCommandCenterProps) {
  const [chartMode, setChartMode] = useState<ChartMode>("planning");
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredVariance, setHoveredVariance] = useState<string | null>(null);

  const chartData: Record<ChartMode, ChartDatum[]> = {
    planning: [
      {
        label: "Budgets",
        value: planningCounts.budgets,
        detail: "Active plan structures in the workspace",
      },
      {
        label: "Forecasts",
        value: planningCounts.forecasts,
        detail: "Rolling outlook lanes in circulation",
      },
      {
        label: "Reports",
        value: planningCounts.reports,
        detail: "Board-pack surfaces tied to live models",
      },
      {
        label: "Workflows",
        value: planningCounts.workflows,
        detail: "Approval programs moving across teams",
      },
    ],
    model: [
      {
        label: "Accounts",
        value: modelCoverage.accounts,
        detail: "Financial account coverage",
      },
      {
        label: "Cost Centers",
        value: modelCoverage.costCenters,
        detail: "Operating ownership mapped",
      },
      {
        label: "Dimensions",
        value: modelCoverage.dimensions,
        detail: "Breakout structure for analysis",
      },
      {
        label: "FX Rates",
        value: modelCoverage.exchangeRates,
        detail: "Exchange-rate records seeded",
      },
    ],
    execution: [
      {
        label: "Approvals",
        value: pendingApprovals,
        detail: "Decisions currently waiting",
      },
      {
        label: "Comments",
        value: openComments,
        detail: "Open collaboration items",
      },
      {
        label: "Inbox",
        value: unreadNotifications,
        detail: "Unread alerts and routed events",
      },
      {
        label: "Snapshots",
        value: planningCounts.versions,
        detail: "Recovery points available",
      },
    ],
  };

  const chartModeMeta: Record<ChartMode, ChartModeMeta> = {
    planning: {
      barSideClass: "bg-[#0b4f68]",
      barTopClass: "bg-[#8ee6dd]",
      glowClass: "bg-[#67e8f9]/20",
      railClass: "bg-[linear-gradient(180deg,rgba(103,232,249,0.16),rgba(45,212,191,0.04))]",
      surfaceClass: "bg-[linear-gradient(180deg,#7dd3fc,#38bdf8,#0f766e)]",
    },
    model: {
      barSideClass: "bg-[#124f47]",
      barTopClass: "bg-[#bef264]",
      glowClass: "bg-[#6ee7b7]/20",
      railClass: "bg-[linear-gradient(180deg,rgba(110,231,183,0.16),rgba(132,204,22,0.04))]",
      surfaceClass: "bg-[linear-gradient(180deg,#6ee7b7,#14b8a6,#0f766e)]",
    },
    execution: {
      barSideClass: "bg-[#1e3a8a]",
      barTopClass: "bg-[#fcd34d]",
      glowClass: "bg-[#93c5fd]/20",
      railClass: "bg-[linear-gradient(180deg,rgba(147,197,253,0.16),rgba(59,130,246,0.04))]",
      surfaceClass: "bg-[linear-gradient(180deg,#93c5fd,#60a5fa,#1d4ed8)]",
    },
  };

  const activeChartData = chartData[chartMode];
  const activeModeMeta = chartModeMeta[chartMode];
  const maxChartValue = Math.max(...activeChartData.map((item) => item.value), 1);
  const featuredBar =
    activeChartData.find((item) => item.label === hoveredBar) ?? activeChartData[0];

  const waterfallItems = buildWaterfall(varianceHighlights.slice(0, 4));
  const maxWaterfallMagnitude = Math.max(
    ...waterfallItems.map((item) => Math.max(Math.abs(item.varianceValue), Math.abs(item.end))),
    1,
  );
  const featuredVariance =
    waterfallItems.find((item) => item.id === hoveredVariance) ?? waterfallItems[0] ?? null;

  const activeWorkflows = workflowStatusBreakdown.pending_approval ?? 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[36px] border border-black/8 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98),rgba(236,245,248,0.96),rgba(227,233,241,0.94))] shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
        <div className="grid gap-8 p-6 xl:grid-cols-[1.04fr_0.96fr] xl:p-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Finance command center</Badge>
              <Badge variant="secondary">{scenarioSummary.active} active scenarios</Badge>
              <Badge variant="outline">{scenarioSummary.linkedForecasts} linked forecasts</Badge>
            </div>

            <div className="space-y-4">
              <h2 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 xl:text-[3.4rem]">
                Replace static status cards with a live operating picture.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                The dashboard now leans into scenario movement, execution pressure, and model
                structure so the first screen feels closer to an FP&A cockpit than a generic admin
                panel.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild leftIcon={<FileSpreadsheet className="size-4" />} variant="secondary">
                <Link href="/workbooks">Open workbooks</Link>
              </Button>
              <Button asChild leftIcon={<ShieldAlert className="size-4" />} variant="outline">
                <Link href="/workflows">Review approvals</Link>
              </Button>
              <Button asChild leftIcon={<BellRing className="size-4" />} variant="ghost">
                <Link href="/notifications">Open inbox</Link>
              </Button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {metrics.map((metric) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={`min-w-[210px] p-4 ${SOFT_PANEL_CLASS}`}
                  initial={{ opacity: 0, y: 10 }}
                  key={metric.label}
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{metric.value}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}% vs prior cycle
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden border-white/70 bg-[linear-gradient(160deg,rgba(13,23,36,0.98),rgba(20,37,52,0.96),rgba(31,59,79,0.93))] text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-white">Interactive model horizon</CardTitle>
                  <CardDescription className="text-white/70">
                    Switch between planning, model, and execution surfaces.
                  </CardDescription>
                </div>
                <div className="relative inline-flex rounded-2xl border border-white/10 bg-white/6 p-1">
                  {(["planning", "model", "execution"] as const).map((mode) => (
                    <button
                      className="relative z-10 min-w-[94px] px-3 py-2 text-xs font-medium capitalize tracking-[0.16em] text-white/78 transition hover:text-white"
                      key={mode}
                      onClick={() => setChartMode(mode)}
                      type="button"
                    >
                      {chartMode === mode ? (
                        <motion.span
                          className="absolute inset-0 rounded-xl bg-white/14 shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
                          layoutId="dashboard-mode-pill"
                          transition={{ type: "spring", stiffness: 260, damping: 28 }}
                        />
                      ) : null}
                      <span className="relative z-10">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                <div
                  className={`relative rounded-[28px] border border-white/10 p-5 [perspective:1400px] ${activeModeMeta.railClass}`}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%)]" />
                  <div className="absolute inset-x-5 bottom-5 top-8 rounded-[24px] border border-dashed border-white/10" />
                  <div className="absolute inset-x-9 bottom-[4.5rem] h-px bg-white/18" />
                  <div className="relative grid min-h-[21rem] grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                    {activeChartData.map((item, index) => {
                      const height = Math.max(
                        (item.value / maxChartValue) * 180,
                        item.value > 0 ? 34 : 14,
                      );
                      const isActive = featuredBar.label === item.label;
                      const shade = 0.94 - index * 0.1;

                      return (
                        <motion.button
                          animate={{ y: isActive ? -6 : 0, scale: isActive ? 1.03 : 1 }}
                          className="group relative flex flex-1 flex-col items-center border-0 bg-transparent p-0 text-left"
                          key={item.label}
                          onFocus={() => setHoveredBar(item.label)}
                          onHoverStart={() => setHoveredBar(item.label)}
                          transition={{ type: "spring", stiffness: 220, damping: 22 }}
                          type="button"
                        >
                          <div className="relative flex h-[14rem] w-full items-end justify-center [transform-style:preserve-3d] sm:h-[16rem]">
                            <div
                              className={`relative w-[62%] max-w-[72px] rounded-t-[18px] ${activeModeMeta.surfaceClass} shadow-[0_18px_34px_rgba(0,0,0,0.24)]`}
                              style={{
                                height,
                                filter: `saturate(${shade}) brightness(${isActive ? 1.06 : 0.92})`,
                              }}
                            >
                              <div className="absolute inset-x-0 top-0 h-8 rounded-t-[18px] bg-white/12" />
                              <div
                                className={`absolute inset-x-0 -top-3 h-3 origin-bottom skew-x-[46deg] rounded-t-[8px] ${activeModeMeta.barTopClass} opacity-95`}
                              />
                              <div
                                className={`absolute -right-3 bottom-0 top-0 w-3 origin-left skew-y-[44deg] ${activeModeMeta.barSideClass}`}
                              />
                            </div>
                          </div>
                          <p className="mt-3 text-center text-sm font-medium text-white">{item.label}</p>
                          <p className="mt-1 text-center text-xs text-white/55">{item.value}</p>
                          <div
                            className={`absolute inset-x-1/2 bottom-20 h-24 w-16 -translate-x-1/2 rounded-full blur-2xl transition-opacity duration-300 ${activeModeMeta.glowClass}`}
                            style={{ opacity: isActive ? 1 : 0 }}
                          />
                          <span className="sr-only">{item.detail}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className={`space-y-4 p-5 ${FROST_PANEL_CLASS}`}>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/50">Focused lane</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{featuredBar.label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/70">{featuredBar.detail}</p>
                  </div>

                  <div className="rounded-[22px] bg-black/18 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/50">Current count</p>
                    <p className="mt-3 text-4xl font-semibold text-white">{featuredBar.value}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[20px] bg-black/18 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/50">Scenario sets</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{scenarioSummary.total}</p>
                    </div>
                    <div className="rounded-[20px] bg-black/18 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/50">Active workflows</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{activeWorkflows}</p>
                    </div>
                  </div>

                  <div className="rounded-[20px] bg-black/18 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/50">Lane slider</p>
                    <div className="mt-4 flex gap-2">
                      {activeChartData.map((item) => (
                        <button
                          aria-label={`Focus ${item.label}`}
                          className="group flex-1 border-0 bg-transparent p-0"
                          key={item.label}
                          onClick={() => setHoveredBar(item.label)}
                          type="button"
                        >
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              animate={{
                                width: `${Math.max((item.value / maxChartValue) * 100, item.value > 0 ? 18 : 8)}%`,
                                opacity: featuredBar.label === item.label ? 1 : 0.52,
                              }}
                              className={`h-full rounded-full ${activeModeMeta.surfaceClass}`}
                              transition={{ duration: 0.35 }}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden border-black/8 bg-[linear-gradient(160deg,rgba(248,250,252,0.96),rgba(241,246,250,0.95),rgba(235,242,248,0.95))]">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Variance waterfall</CardTitle>
                <CardDescription>
                  A more cinematic view of recent favorable and unfavorable movement.
                </CardDescription>
              </div>
              <Badge variant="outline">{varianceHighlights.length} tracked deltas</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div
              className="relative overflow-hidden rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(241,245,249,0.94))] p-5"
              onMouseLeave={() => setHoveredVariance(null)}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_32%)]" />
              <div className="space-y-4">
                {waterfallItems.length === 0 ? (
                  <p className="text-sm text-slate-500">No variances logged yet.</p>
                ) : (
                  waterfallItems.map((item) => {
                    const widthPercent = Math.max(
                      (Math.abs(item.varianceValue) / maxWaterfallMagnitude) * 100,
                      10,
                    );
                    const isPositive = item.varianceValue >= 0;
                    const isActive = featuredVariance?.id === item.id;

                    return (
                      <motion.button
                        animate={{ y: isActive ? -4 : 0, scale: isActive ? 1.01 : 1 }}
                        className={`group relative w-full rounded-[24px] border border-black/8 p-4 text-left ${isActive ? "bg-white/86 shadow-[0_18px_36px_rgba(15,23,42,0.08)]" : "bg-white/68"}`}
                        key={item.id}
                        onFocus={() => setHoveredVariance(item.id)}
                        onHoverStart={() => setHoveredVariance(item.id)}
                        transition={{ type: "spring", stiffness: 210, damping: 22 }}
                        type="button"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-950">{item.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                              {item.periodLabel}
                            </p>
                          </div>
                          <p
                            className={`text-sm font-semibold ${isPositive ? "text-emerald-700" : "text-rose-700"}`}
                          >
                            {formatMetricValue(item.varianceValue, "currency")}
                          </p>
                        </div>

                        <div className="relative mt-4 h-12">
                          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-300" />
                          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
                          <div
                            className={`absolute top-1/2 h-4 -translate-y-1/2 rounded-full shadow-[0_10px_24px_rgba(15,23,42,0.12)] ${
                              isPositive
                                ? "left-1/2 bg-[linear-gradient(90deg,#5eead4,#14b8a6,#0f766e)]"
                                : "right-1/2 bg-[linear-gradient(90deg,#fb7185,#ef4444,#be123c)]"
                            }`}
                            style={{ width: `${widthPercent / 2}%` }}
                          />
                          <div
                            className={`absolute top-1/2 size-3 -translate-y-1/2 rounded-full ${isPositive ? "bg-[#0f766e]" : "bg-[#be123c]"}`}
                            style={{
                              left: isPositive ? `calc(50% + ${widthPercent / 2}% - 0.375rem)` : undefined,
                              right: !isPositive ? `calc(50% + ${widthPercent / 2}% - 0.375rem)` : undefined,
                            }}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                          <span>{isPositive ? "Favorable move" : "Unfavorable move"}</span>
                          <span>{item.variancePercent !== null ? formatSignedPercent(item.variancePercent) : "N/A"}</span>
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>
            </div>

            {featuredVariance ? (
              <div className="grid gap-4 md:grid-cols-3">
                <div className={`${SOFT_PANEL_CLASS} p-4`}>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Variance</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">
                    {formatMetricValue(featuredVariance.varianceValue, "currency")}
                  </p>
                </div>
                <div className={`${SOFT_PANEL_CLASS} p-4`}>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">
                    {featuredVariance.status.replaceAll("_", " ")}
                  </p>
                </div>
                <div className={`${SOFT_PANEL_CLASS} p-4`}>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Spread</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">
                    {featuredVariance.variancePercent !== null
                      ? `${featuredVariance.variancePercent.toFixed(1)}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(245,247,250,0.95))]">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Action inbox</CardTitle>
                <CardDescription>
                  The decision queue, routed alerts, and collaboration pressure in one place.
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/workflows">Open approvals</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] bg-[linear-gradient(180deg,rgba(13,23,36,0.98),rgba(20,37,52,0.96))] p-4 text-white">
                <ShieldAlert className="size-5 text-amber-300" />
                <p className="mt-4 text-3xl font-semibold">{pendingApprovals}</p>
                <p className="mt-2 text-sm text-white/70">Pending approvals</p>
              </div>
              <div className={`${SOFT_PANEL_CLASS} p-4`}>
                <GitBranchPlus className="size-5 text-sky-600" />
                <p className="mt-4 text-3xl font-semibold text-slate-950">{openComments}</p>
                <p className="mt-2 text-sm text-slate-600">Open comments</p>
              </div>
              <div className={`${SOFT_PANEL_CLASS} p-4`}>
                <BellRing className="size-5 text-emerald-600" />
                <p className="mt-4 text-3xl font-semibold text-slate-950">{unreadNotifications}</p>
                <p className="mt-2 text-sm text-slate-600">Unread alerts</p>
              </div>
            </div>

            <div className="space-y-3">
              {latestNotifications.length === 0 ? (
                <p className="text-sm text-slate-500">No notifications yet.</p>
              ) : (
                latestNotifications.map((item) => (
                  <div className={`${SOFT_PANEL_CLASS} p-4`} key={item.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                      </div>
                      <Badge variant={item.readAt ? "outline" : "gradient"}>{item.kind}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {new Date(item.createdAt).toLocaleString("en-US")}
                      </p>
                      {item.link ? (
                        <Button asChild size="sm" variant="ghost">
                          <Link href={item.link}>Open</Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Workbook health</CardTitle>
                <CardDescription>
                  Ownership, collaborator depth, and freshness of the active model set.
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/workbooks">Open workbook library</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {workbooks.length === 0 ? (
              <p className="text-sm text-slate-500">No workbooks created yet.</p>
            ) : (
              workbooks.map((workbook, index) => (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className={`${SOFT_PANEL_CLASS} p-4`}
                  initial={{ opacity: 0, x: 12 }}
                  key={workbook.id}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link className="font-medium text-slate-950 hover:text-primary" href={`/workbooks/${workbook.id}`}>
                          {workbook.name}
                        </Link>
                        <Badge variant={getBadgeVariant(workbook.status)}>{workbook.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{workbook.description}</p>
                    </div>
                    <Layers3 className="size-5 text-slate-400" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Owner</p>
                      <p className="mt-2 text-sm font-medium text-slate-950">{workbook.owner}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Collaborators</p>
                      <p className="mt-2 text-sm font-medium text-slate-950">{workbook.collaborators}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Updated</p>
                      <p className="mt-2 text-sm font-medium text-slate-950">
                        {new Date(workbook.updatedAt).toLocaleDateString("en-US")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-black/8 bg-[linear-gradient(180deg,rgba(13,23,36,0.98),rgba(18,45,63,0.96))] text-white">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-white">Signal studio</CardTitle>
                <CardDescription className="text-white/70">
                  KPI trend ribbons and recent audit activity across the platform.
                </CardDescription>
              </div>
              <Badge className="border-white/20 text-white" variant="outline">
                {recentAuditEvents.length} audit events
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              {metricHighlights.length === 0 ? (
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 text-sm text-white/72">
                  KPI metrics will appear here once tracking is active.
                </div>
              ) : (
                metricHighlights.map((metric) => (
                  <div className={`${FROST_PANEL_CLASS} p-4`} key={metric.id}>
                    {(() => {
                      const ratio = getMetricRatio(metric.actualValue, metric.targetValue);

                      return (
                        <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{metric.name}</p>
                        <p className="mt-1 text-sm text-white/55">
                          Target {formatMetricValue(metric.targetValue, metric.unit)}
                        </p>
                      </div>
                      <Badge variant={ratio !== null && ratio >= 0 ? "success" : "warning"}>
                        {ratio !== null ? formatSignedPercent(ratio) : "Flat"}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <div className="mb-3 flex items-center justify-between text-sm text-white/65">
                        <span>{formatMetricValue(metric.actualValue, metric.unit)}</span>
                        <span>{metric.unit}</span>
                      </div>
                      <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          animate={{
                            width: `${Math.min(
                              metric.actualValue && metric.targetValue
                                ? Math.max((metric.actualValue / metric.targetValue) * 100, 8)
                                : 12,
                              100,
                            )}%`,
                          }}
                          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#5eead4,#60a5fa,#a78bfa)]"
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-white/52">
                        <span>Target {formatMetricValue(metric.targetValue, metric.unit)}</span>
                        <span>
                          {ratio !== null
                            ? `${ratio >= 0 ? "Ahead" : "Behind"} ${formatSignedPercent(ratio)}`
                            : "No ratio"}
                        </span>
                      </div>
                    </div>
                        </>
                      );
                    })()}
                  </div>
                ))
              )}
            </div>

            <div className={`${FROST_PANEL_CLASS} p-5`}>
              <div className="mb-4 flex items-center gap-2 text-white/72">
                <Clock3 className="size-4" />
                <p className="text-sm font-medium text-white">Audit pulse</p>
              </div>
              <div className="space-y-3">
                {recentAuditEvents.length === 0 ? (
                  <p className="text-sm text-white/60">No audit events captured yet.</p>
                ) : (
                  recentAuditEvents.map((event) => (
                    <div className="flex items-start gap-3 rounded-[22px] bg-black/16 px-4 py-3" key={event.id}>
                      <div className="mt-1 rounded-full bg-cyan-300/25 p-2">
                        <TrendingUp className="size-4 text-cyan-200" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {event.action.replaceAll("_", " ")} on {event.entityType}
                        </p>
                        <p className="mt-1 text-sm text-white/60">
                          {new Date(event.createdAt).toLocaleString("en-US")}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={`${FROST_PANEL_CLASS} bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.14),transparent_28%),rgba(255,255,255,0.06)] p-5`}>
              <div className="flex items-center gap-2 text-white/72">
                <Sparkles className="size-4" />
                <p className="text-sm font-medium text-white">Executive pulse</p>
              </div>
              <p className="mt-4 text-2xl font-semibold text-white">
                {scenarioSummary.active} active scenarios, {pendingApprovals} pending approvals,
                and {unreadNotifications} unread alerts are defining the current cycle.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/65">
                This is the surface to keep refining with deeper report previews, approval drill
                downs, and workbook history once the command-center structure feels right.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] bg-black/18 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/48">Cycle delta</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-300">
                    {formatSignedPercent(
                      metrics.reduce((sum, metric) => sum + metric.change, 0) / Math.max(metrics.length, 1),
                    )}
                  </p>
                </div>
                <div className="rounded-[20px] bg-black/18 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/48">Variance bias</p>
                  <p className={`mt-2 text-lg font-semibold ${varianceHighlights.some((item) => item.varianceValue < 0) ? "text-rose-300" : "text-emerald-300"}`}>
                    {varianceHighlights.some((item) => item.varianceValue < 0) ? "Negative skew" : "Positive skew"}
                  </p>
                </div>
                <div className="rounded-[20px] bg-black/18 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/48">Inbox load</p>
                  <p className="mt-2 text-lg font-semibold text-cyan-300">
                    {pendingApprovals + unreadNotifications > 0
                      ? `+${pendingApprovals + unreadNotifications} routed`
                      : "0 routed"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
