"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Database,
  FileSpreadsheet,
  LockKeyhole,
  MessageSquareMore,
  RefreshCcw,
  Workflow,
} from "lucide-react";

import {
  MotionPresets,
  MotionReveal,
} from "@/components/marketing/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const bentoItems = [
  {
    icon: BarChart3,
    title: "Executive visibility",
    description:
      "See coverage, risk, and cycle movement from one planning cockpit.",
    className: "md:col-span-2 xl:col-span-7 xl:row-span-2",
    panel: "chart" as const,
  },
  {
    icon: FileSpreadsheet,
    title: "Workbook-native modeling",
    description:
      "Operators keep the grid muscle memory while finance keeps the control layer.",
    className: "md:col-span-1 xl:col-span-5",
    panel: "summary" as const,
  },
  {
    icon: LockKeyhole,
    title: "Role-based control",
    description:
      "Editing, review, and publish permissions stay enforced at the workflow layer.",
    className: "md:col-span-1 xl:col-span-5",
    panel: "control" as const,
  },
  {
    icon: Database,
    title: "Source-of-truth data",
    description:
      "Budgets, actuals, and scenarios stay attached to one shared model.",
    className: "md:col-span-1 xl:col-span-3",
    panel: "metrics" as const,
  },
  {
    icon: RefreshCcw,
    title: "Realtime collaboration",
    description:
      "Reviews update live, and version drift stays out of the process.",
    className: "md:col-span-1 xl:col-span-4",
    panel: "activity" as const,
  },
  {
    icon: MessageSquareMore,
    title: "Commentary in context",
    description:
      "Discussion stays next to assumptions so the model is explainable under pressure.",
    className: "md:col-span-2 xl:col-span-5",
    panel: "threads" as const,
  },
];

const workflow = [
  {
    step: "01",
    title: "Model once",
    description:
      "Build driver-based plans inside workbook structures teams already understand.",
  },
  {
    step: "02",
    title: "Review in context",
    description:
      "Route approvals, commentary, and issues through the exact assumptions they depend on.",
  },
  {
    step: "03",
    title: "Publish with confidence",
    description:
      "Deliver dashboards and board-pack exports from the same source model without copy-paste drift.",
  },
];

const forecastColumns = [
  { label: "Q1", committed: 38, revised: 46 },
  { label: "Q2", committed: 52, revised: 62 },
  { label: "Q3", committed: 60, revised: 74 },
  { label: "Q4", committed: 68, revised: 86 },
];

const scenarioSignals = [
  {
    title: "Demand ramp",
    value: "+12%",
    note: "Expansion plan reopened after pipeline recovery.",
  },
  {
    title: "Hiring plan",
    value: "6 roles",
    note: "Ops and finance approvals landed in the same cycle.",
  },
];

function PlatformVisual({
  panel,
}: {
  panel: (typeof bentoItems)[number]["panel"];
}) {
  const prefersReducedMotion = useReducedMotion();

  if (panel === "chart") {
    return (
      <div className="relative mt-4 flex min-h-[30rem] flex-1 flex-col rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),transparent)] p-6 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]">
        <div className="flex items-center justify-between text-[11px] tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400">
          <span>Forecast scene</span>
          <span>Live model</span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ["Coverage", "92%", "text-emerald-600 dark:text-emerald-400"],
            ["Exposure", "03", "text-red-600 dark:text-red-400"],
            ["Sync lag", "14s", "text-black dark:text-white"],
          ].map(([label, value, tone], index) => (
            <motion.div
              key={label}
              className="rounded-[20px] border border-black/8 bg-white/90 px-4 py-3 dark:border-white/10 dark:bg-black/88"
              animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
              transition={{
                duration: 3.2,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.14,
              }}
            >
              <p className="text-[10px] tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
                {label}
              </p>
              <p className={cn("mt-2 text-2xl font-semibold", tone)}>{value}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 grid flex-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <div className="min-w-0 rounded-[24px] border border-black/8 bg-white/92 p-5 dark:border-white/10 dark:bg-black/88">
            <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
              <span>Quarterly ladder</span>
              <span>Realtime revision</span>
            </div>
            <div className="relative mt-4 overflow-hidden rounded-[20px] border border-black/6 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),transparent_48%)] px-4 pt-5 pb-6 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_48%)]">
              <div className="pointer-events-none absolute inset-x-4 top-5 grid gap-5">
                {[0, 1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="border-t border-dashed border-black/8 dark:border-white/10"
                  />
                ))}
              </div>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                viewBox="0 0 320 220"
              >
                <motion.path
                  d="M24 162 C 72 138, 112 126, 154 102 S 232 70, 294 46"
                  fill="none"
                  stroke="rgba(17,24,39,0.72)"
                  strokeDasharray="8 10"
                  strokeLinecap="round"
                  strokeWidth="4"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { pathLength: [0.86, 1, 0.92, 1] }
                  }
                  transition={{
                    duration: 4.8,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </svg>
              <div className="relative z-10 grid min-h-[18rem] grid-cols-4 gap-3 sm:gap-4">
                {forecastColumns.map((quarter, index) => (
                  <div
                    key={quarter.label}
                    className="flex min-w-0 flex-col justify-end gap-3"
                  >
                    <div className="flex h-full items-end justify-center gap-2">
                      <motion.div
                        className="flex flex-1 items-end justify-center"
                        animate={
                          prefersReducedMotion ? undefined : { y: [0, -6, 0] }
                        }
                        transition={{
                          duration: 3.2,
                          ease: "easeInOut",
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.1,
                        }}
                      >
                        <div
                          className="w-full max-w-[38px] rounded-t-[16px] border border-black/10 bg-neutral-300 shadow-[0_12px_24px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-neutral-700"
                          style={{ height: `${quarter.committed}%` }}
                        />
                      </motion.div>
                      <motion.div
                        className="flex flex-1 items-end justify-center"
                        animate={
                          prefersReducedMotion ? undefined : { y: [0, -8, 0] }
                        }
                        transition={{
                          duration: 3.4,
                          ease: "easeInOut",
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.16,
                        }}
                      >
                        <div
                          className="w-full max-w-[38px] rounded-t-[16px] border border-black/10 bg-black shadow-[0_18px_28px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-white"
                          style={{ height: `${quarter.revised}%` }}
                        />
                      </motion.div>
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-[10px] font-medium tracking-[0.2em] text-neutral-500 uppercase dark:text-neutral-400">
                        {quarter.label}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300">
                        {quarter.committed}% / {quarter.revised}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {scenarioSignals.map((signal) => (
                <div
                  key={signal.title}
                  className="min-w-0 rounded-[18px] border border-black/8 bg-neutral-50 px-4 py-4 dark:border-white/10 dark:bg-neutral-950"
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {signal.title}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-pretty text-neutral-600 dark:text-neutral-300">
                        {signal.note}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-semibold text-black dark:border-white/10 dark:bg-black dark:text-white">
                      {signal.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <motion.div
              className="rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_18px_36px_rgba(0,0,0,0.08)] dark:border-white/12 dark:bg-black dark:shadow-[0_18px_36px_rgba(0,0,0,0.36)]"
              animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
              transition={{
                duration: 4.8,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
                  Plan health
                </p>
                <span className="rounded-full border border-black/8 px-2 py-1 text-[10px] tracking-[0.16em] text-neutral-500 uppercase dark:border-white/10 dark:text-neutral-400">
                  Stable
                </span>
              </div>
              <div className="mt-5 grid grid-cols-[auto_1fr] gap-4">
                <div className="relative flex size-16 items-center justify-center rounded-full border border-black/8 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950">
                  <motion.div
                    className="absolute inset-2 rounded-full border-2 border-dashed border-black/12 dark:border-white/14"
                    animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                    transition={{
                      duration: 10,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    98
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-300">
                      Variance
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +4.8%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-300">
                      Runway
                    </span>
                    <span className="font-semibold text-black dark:text-white">
                      16 mo
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-900">
                  <motion.div
                    className="h-2 rounded-full bg-black dark:bg-white"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { width: ["52%", "74%", "64%", "74%"] }
                    }
                    transition={{
                      duration: 5.2,
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </div>
                <div className="flex items-end gap-1.5">
                  {[22, 36, 32, 54, 48, 68, 62].map((height, index) => (
                    <motion.div
                      key={height}
                      className="w-full rounded-t-full bg-black/16 dark:bg-white/18"
                      style={{ height }}
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : { height: [height - 4, height, height - 1, height] }
                      }
                      transition={{
                        duration: 2.8,
                        ease: "easeInOut",
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.08,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            <div className="rounded-[24px] border border-black/8 bg-white/92 p-5 dark:border-white/10 dark:bg-black/88">
              <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
                  Scenario drift
                </p>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  2 alerts
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  [
                    "Demand ramp",
                    "In review",
                    "text-neutral-700 dark:text-neutral-200",
                  ],
                  [
                    "Hiring plan",
                    "Back on target",
                    "text-emerald-600 dark:text-emerald-400",
                  ],
                ].map(([label, value, tone]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-[18px] border border-black/8 bg-neutral-50 px-3 py-2.5 dark:border-white/10 dark:bg-neutral-950"
                  >
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {label}
                    </span>
                    <span className={cn("text-sm font-medium", tone)}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (panel === "summary") {
    return (
      <div className="mt-4 grid gap-3">
        {[
          ["Sheets", "24"],
          ["Scenario sets", "7"],
          ["Approval lanes", "5"],
        ].map(([label, value], index) => (
          <motion.div
            key={label}
            className="flex items-center justify-between rounded-[20px] border border-black/8 bg-white px-4 py-3 dark:border-white/10 dark:bg-black"
            animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
            transition={{
              duration: 3.4,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.14,
            }}
          >
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              {label}
            </span>
            <span className="text-lg font-semibold text-black dark:text-white">
              {value}
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (panel === "metrics") {
    return (
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          ["Actuals sync", "99.2%", "text-emerald-600 dark:text-emerald-400"],
          ["Blocked items", "03", "text-red-600 dark:text-red-400"],
          ["Published packs", "12", "text-black dark:text-white"],
          ["Refresh lag", "4m", "text-black dark:text-white"],
        ].map(([label, value, tone], index) => (
          <motion.div
            key={label}
            className="rounded-[20px] border border-black/8 bg-white p-4 dark:border-white/10 dark:bg-black"
            animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
            transition={{
              duration: 3.2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.12,
            }}
          >
            <p className="text-[11px] tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
              {label}
            </p>
            <p className={cn("mt-3 text-2xl font-semibold", tone)}>{value}</p>
          </motion.div>
        ))}
      </div>
    );
  }

  if (panel === "activity") {
    return (
      <div className="mt-4 space-y-3">
        {[
          ["Revenue owner updated demand assumption", "12s ago"],
          ["Hiring plan sent to finance review", "1m ago"],
          ["Pack export completed for board deck", "4m ago"],
        ].map(([text, time], index) => (
          <motion.div
            key={text}
            className="flex items-start gap-3 rounded-[20px] border border-black/8 bg-white px-4 py-3 transition-transform duration-200 hover:-translate-y-0.5 dark:border-white/10 dark:bg-black"
            animate={prefersReducedMotion ? undefined : { x: [0, 4, 0] }}
            transition={{
              duration: 4.2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.16,
            }}
          >
            <span className="mt-1 size-2 rounded-full bg-black dark:bg-white" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-black dark:text-white">{text}</p>
              <p className="mt-1 text-xs tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
                {time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (panel === "control") {
    return (
      <div className="mt-4 space-y-4 rounded-[24px] border border-black/8 bg-white p-5 dark:border-white/10 dark:bg-black">
        {(
          [
            ["Editors", true],
            ["Approvers", true],
            ["Viewers", false],
          ] as const
        ).map(([label, enabled]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-black dark:text-white">
                {label}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Scoped to workbook permissions
              </p>
            </div>
            <div
              className={cn(
                "flex h-7 w-12 items-center rounded-full border p-1 transition-colors duration-200",
                enabled
                  ? "border-black bg-black dark:border-white dark:bg-white"
                  : "border-black/14 bg-neutral-200 dark:border-white/14 dark:bg-neutral-800",
              )}
            >
              <div
                className={cn(
                  "size-5 rounded-full transition-transform duration-200",
                  enabled
                    ? "translate-x-5 bg-white dark:bg-black"
                    : "translate-x-0 bg-black dark:bg-white",
                )}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {[
        ["Commentary attached to demand ramp", "Needs rev-2 approval"],
        ["Margin assumption revised", "Audit note preserved"],
      ].map(([title, meta], index) => (
        <motion.div
          key={title}
          className="rounded-[20px] border border-black/8 bg-white px-4 py-4 dark:border-white/10 dark:bg-black"
          animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.2,
          }}
        >
          <p className="text-sm font-medium text-black dark:text-white">
            {title}
          </p>
          <p className="mt-2 text-xs tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
            {meta}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export function FeatureGrid() {
  return (
    <div className="pb-24">
      <section
        className="mx-auto max-w-7xl scroll-mt-28 px-4 py-10 sm:px-6 lg:px-8"
        id="definition"
      >
        <MotionReveal {...MotionPresets.fadeUp}>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <Card className="glass-strong border-black/8 dark:border-white/10">
              <CardContent className="p-8">
                <p className="text-sm font-medium tracking-[0.24em] text-neutral-500 uppercase dark:text-neutral-400">
                  Definition
                </p>
                <h2 className="mt-4 text-3xl font-[var(--font-heading)] font-semibold tracking-tight text-black sm:text-4xl dark:text-white">
                  A spreadsheet-native planning system for budgets, forecasts,
                  approvals, and reporting.
                </h2>
              </CardContent>
            </Card>

            <Card className="glass-strong border-black/8 dark:border-white/10">
              <CardContent className="grid gap-6 p-8 text-base leading-8 text-neutral-700 lg:grid-cols-2 dark:text-neutral-300">
                <p>
                  Native FP&amp;A keeps the grid, formulas, and workbook mental
                  model that finance teams already move fast in. What changes is
                  the operating layer around it: permissions, live
                  collaboration, review states, auditability, and publish-ready
                  outputs.
                </p>
                <p>
                  The result is one shared model that finance, business owners,
                  and leadership can trust at the same time, without the usual
                  spreadsheet sprawl.
                </p>
              </CardContent>
            </Card>
          </div>
        </MotionReveal>
      </section>

      <section
        className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8"
        id="platform"
      >
        <MotionReveal {...MotionPresets.fadeUp}>
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge className="mb-4 w-fit" variant="gradient">
                Platform compatibilities
              </Badge>
              <h2 className="text-3xl font-[var(--font-heading)] font-semibold tracking-tight text-black sm:text-4xl dark:text-white">
                Bento-grid product surfaces instead of another flat feature
                list.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
              The platform section now behaves like a product preview: dense,
              mixed-size modules with live-looking motion and stronger scanning.
            </p>
          </div>
        </MotionReveal>

        <div className="grid auto-rows-[minmax(220px,auto)] gap-5 md:grid-cols-2 xl:grid-flow-dense xl:grid-cols-12">
          {bentoItems.map((item, index) => (
            <MotionReveal
              key={item.title}
              {...MotionPresets.fadeUp}
              delay={index * 0.08}
              className={item.className}
            >
              <Card
                className="group h-full min-w-0 overflow-hidden border-black/8 dark:border-white/10"
                hover
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex size-12 items-center justify-center rounded-2xl border border-black/8 bg-black text-white shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-transform duration-300 group-hover:-translate-y-0.5 dark:border-white/10 dark:bg-white dark:text-black">
                        <item.icon className="size-5" />
                      </div>
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                    <span className="rounded-full border border-black/8 px-3 py-1 text-[11px] tracking-[0.18em] text-neutral-500 uppercase dark:border-white/10 dark:text-neutral-400">
                      Module
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex h-full flex-col pt-0">
                  <PlatformVisual panel={item.panel} />
                </CardContent>
              </Card>
            </MotionReveal>
          ))}
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8"
        id="workflow"
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <MotionReveal {...MotionPresets.slideRight}>
            <Card
              className="relative h-full overflow-hidden border-black/8 bg-black text-white dark:border-white/10"
              hover
            >
              <CardContent className="relative flex h-full flex-col justify-between gap-8 p-8">
                <div>
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
                    <Workflow className="size-5" />
                  </div>
                  <p className="text-sm tracking-[0.24em] text-white/70 uppercase">
                    Workflow
                  </p>
                  <h2 className="mt-4 text-3xl font-[var(--font-heading)] font-semibold tracking-tight sm:text-4xl">
                    Smooth motion in the page, disciplined flow in the product.
                  </h2>
                </div>
                <p className="max-w-xl text-base leading-8 text-white/78">
                  The motion now stays quieter and more directional. Big moves
                  are reserved for structural reveals, while cards respond with
                  shallow depth and faster feedback.
                </p>
              </CardContent>
            </Card>
          </MotionReveal>

          <div className="space-y-4">
            {workflow.map((item, index) => (
              <MotionReveal
                key={item.step}
                {...MotionPresets.slideLeft}
                delay={index * 0.12}
              >
                <Card
                  className="group overflow-hidden border-black/8 dark:border-white/10"
                  hover
                >
                  <CardContent className="flex flex-col gap-4 p-7 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.32em] text-neutral-500 uppercase dark:text-neutral-400">
                        {item.step}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-black transition-opacity duration-200 group-hover:opacity-70 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="max-w-md text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <MotionReveal {...MotionPresets.scaleIn}>
          <Card className="relative overflow-hidden border-black/8 bg-white dark:border-white/10 dark:bg-black">
            <CardContent className="relative flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
              <div className="max-w-2xl">
                <p className="text-sm font-medium tracking-[0.24em] text-neutral-500 uppercase dark:text-neutral-400">
                  Ready to get started
                </p>
                <h2 className="mt-3 text-3xl font-[var(--font-heading)] font-semibold tracking-tight text-black sm:text-4xl dark:text-white">
                  Start building your finance operating model today.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="primary">
                  <Link href="/signup">
                    Launch workspace
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/dashboard">Open product shell</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </MotionReveal>
      </section>
    </div>
  );
}
