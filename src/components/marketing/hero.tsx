"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BotMessageSquare,
  ChartSpline,
  ShieldCheck,
  Sparkles,
  TableProperties,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { MotionReveal, MotionPresets } from "@/components/marketing/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const valueProps = [
  {
    icon: TableProperties,
    title: "Spreadsheet-native control",
    description:
      "Keep the grid mental model while centralizing formulas, permissions, and version awareness.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready collaboration",
    description:
      "Track workbook ownership, approvals, and live changes without passing files around.",
  },
  {
    icon: Sparkles,
    title: "Planning system, not a file share",
    description:
      "Turn fragmented budgets into structured workflows for finance, ops, and department leads.",
  },
];

const commandTape = [
  "Budget owners update assumptions directly in the grid",
  "Approvals stay attached to the cells they change",
  "Leadership sees plan risk before the meeting starts",
  "Forecasts stay versioned, reviewable, and export-ready",
];

const cockpitMetrics = [
  {
    label: "Revenue",
    value: "$1.66M",
    meta: "-3.2% vs target",
    tone: "negative" as const,
  },
  {
    label: "Gross Margin",
    value: "$911K",
    meta: "+2.1% vs target",
    tone: "positive" as const,
  },
  {
    label: "Headcount Pace",
    value: "84%",
    meta: "4 reqs blocked",
    tone: "negative" as const,
  },
];

const heroSignals = [
  { label: "Planners online", value: "24", tone: "text-black dark:text-white" },
  { label: "Review latency", value: "4m", tone: "text-emerald-600 dark:text-emerald-400" },
  { label: "Risk drivers", value: "03", tone: "text-red-600 dark:text-red-400" },
];

const proofPoints = [
  "Realtime workbook sync",
  "Board-pack ready outputs",
  "Approvals attached to assumptions",
];

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
      <div className="absolute inset-0 -z-20 bg-hero-radial opacity-90" />
      <div className="absolute left-[8%] top-10 -z-10 h-56 w-56 rounded-full bg-black/4 blur-3xl dark:bg-white/5" />
      <div className="absolute right-[10%] top-24 -z-10 h-72 w-72 rounded-full bg-black/3 blur-3xl dark:bg-white/4" />
      <div className="absolute bottom-0 left-1/2 -z-10 h-64 w-[34rem] -translate-x-1/2 rounded-full bg-black/3 blur-3xl dark:bg-white/4" />

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
        <div className="space-y-8">
          <MotionReveal {...MotionPresets.fadeUp} delay={0.14}>
            <div className="space-y-5">
              <Badge
                className="w-fit"
                variant="gradient"
              >
                <Sparkles className="size-3.5" />
                Native Financial Planning for operators, reviewers, and execs
              </Badge>
              <h1 className="text-balance max-w-5xl text-4xl font-[var(--font-heading)] font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                The finance operating system that feels{" "}
                <span className="border-b border-current pb-1">
                  familiar
                </span>
                , but behaves like software.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-neutral-700 dark:text-neutral-300 sm:text-lg lg:text-xl">
                Native FP&amp;A is a spreadsheet-native planning workspace for
                budgeting, forecasting, approvals, and leadership review. It keeps
                the speed of the grid while replacing version sprawl with one live
                operating model.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                {proofPoints.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5 shadow-[0_8px_18px_rgba(0,0,0,0.04)] dark:border-white/12 dark:bg-black/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
                {heroSignals.map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="rounded-[20px] border border-black/8 bg-white/88 px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/88"
                    animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
                    transition={{
                      duration: 3.1,
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.12,
                    }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                      {item.label}
                    </p>
                    <p className={cn("mt-2 text-2xl font-semibold", item.tone)}>{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal {...MotionPresets.fadeUp} delay={0.24}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="primary">
                <Link href="/signup">
                  Start planning
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#definition">
                  See the definition
                  <ArrowDown className="size-4" />
                </Link>
              </Button>
            </div>
          </MotionReveal>

          <MotionReveal {...MotionPresets.fadeUp} delay={0.34}>
            <div className="grid gap-4 sm:grid-cols-3">
              {valueProps.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-black/16 hover:bg-neutral-50 dark:border-white/10 dark:bg-black dark:hover:border-white/18 dark:hover:bg-neutral-950"
                >
                  <item.icon className="mb-4 size-5 text-black transition-colors duration-200 group-hover:opacity-70 dark:text-white" />
                  <p className="mb-2 font-medium text-black dark:text-white">{item.title}</p>
                  <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </MotionReveal>
        </div>

        <MotionReveal {...MotionPresets.slideLeft} delay={0.3}>
          <Card className="relative overflow-hidden border-black/8 bg-white dark:border-white/10 dark:bg-black" hover>
            <div className="pointer-events-none absolute inset-x-10 top-6 h-24 rounded-full bg-black/6 blur-3xl dark:bg-white/8" />
            <CardContent className="p-0">
              <div className="border-b border-black/8 p-5 dark:border-white/10 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400 sm:text-sm">
                      Live cockpit
                    </p>
                    <h2 className="mt-2 text-2xl font-[var(--font-heading)] font-semibold text-black dark:text-white sm:text-3xl">
                      FY27 Operating Plan
                    </h2>
                  </div>
                  <Badge variant="success" dot dotColor="bg-emerald-500">
                    Realtime sync
                  </Badge>
                </div>

                <div className="rounded-[28px] border border-black/8 bg-neutral-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-white/10 dark:bg-neutral-950">
                  <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                    <ChartSpline className="size-4" />
                    Review rhythm
                  </div>
                  <div className="relative mb-4 overflow-hidden rounded-[24px] border border-black/6 bg-white/90 px-3 py-4 dark:border-white/10 dark:bg-black/80">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),transparent_42%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_42%)]" />
                    <div className="pointer-events-none absolute inset-x-8 bottom-0 h-20 rounded-full bg-black/5 blur-2xl dark:bg-white/8" />
                    <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                      <span>Forecast depth</span>
                      <span>6 segments live</span>
                    </div>
                    <div className="grid h-28 grid-cols-6 items-end gap-2">
                      {[38, 62, 48, 84, 70, 96].map((value, index) => (
                        <motion.div
                          key={value}
                          className="relative h-full"
                          animate={
                            prefersReducedMotion
                              ? undefined
                              : { y: [0, -4, 0] }
                          }
                          transition={{
                            duration: 2.8,
                            ease: "easeInOut",
                            repeat: Number.POSITIVE_INFINITY,
                            delay: index * 0.12,
                          }}
                        >
                          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border border-black/8 bg-black dark:border-white/10 dark:bg-white" style={{ height: `${value}%` }} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {cockpitMetrics.map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="flex items-center justify-between rounded-2xl border border-black/6 bg-white px-3 py-2.5 shadow-sm transition-colors duration-200 hover:bg-neutral-50 dark:border-white/10 dark:bg-black dark:hover:bg-neutral-950 sm:px-4 sm:py-3"
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : { y: [0, -3, 0] }
                        }
                        transition={{
                          duration: 3.2,
                          ease: "easeInOut",
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.16,
                        }}
                      >
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">{item.label}</p>
                          <p className="text-sm font-medium text-black dark:text-white sm:text-base">{item.value}</p>
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1 text-xs font-medium sm:text-sm",
                            item.tone === "positive"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {item.tone === "positive" ? (
                            <TrendingUp className="size-3.5 sm:size-4" />
                          ) : (
                            <TrendingDown className="size-3.5 sm:size-4" />
                          )}
                          <span>{item.meta}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 border-t border-black/8 bg-black px-5 py-6 text-white dark:border-white/10 sm:px-6 sm:py-7">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/70 sm:text-sm">
                    <BotMessageSquare className="size-4" />
                    Review queue
                  </div>
                  <p className="text-xs text-white/60 sm:text-sm">7 active threads</p>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {[
                    "Marketing scenario unlocked after spend guardrail approval.",
                    "Hiring plan flagged because pipeline assumptions slipped two weeks.",
                    "Board pack refresh ready with variance notes attached to each driver.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2.5 text-xs leading-6 text-white/82 transition-colors duration-200 hover:bg-white/10 sm:px-4 sm:text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/12 bg-white/8 px-3 py-2.5 text-xs text-white/86 sm:px-4 sm:text-sm">
                  Model health is stable. 98.4% of workbook checks passed during
                  the latest sync.
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionReveal>
      </div>

      <MotionReveal {...MotionPresets.fadeUp} delay={0.5}>
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[28px] border border-black/8 bg-white dark:border-white/10 dark:bg-black">
            <div className="flex min-w-max animate-marquee gap-4 py-3">
              {[...commandTape, ...commandTape].map((item, index) => (
                <div
                  className="flex items-center gap-3 whitespace-nowrap px-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 sm:gap-4 sm:text-sm"
                  key={`${item}-${index}`}
                >
                  <span className="rounded-full bg-black px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white dark:bg-white dark:text-black sm:text-[11px]">
                    Live
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["Exports", "12 board packs"],
              ["Review lanes", "5 active flows"],
              ["Scenario drift", "2 items flagged"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[22px] border border-black/8 bg-white/88 px-4 py-3 text-sm text-neutral-700 shadow-[0_10px_24px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-black/88 dark:text-neutral-300"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  {label}
                </p>
                <p className="mt-2 font-medium text-black dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}
