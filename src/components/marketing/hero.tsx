import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TableProperties } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const valueProps = [
  {
    icon: TableProperties,
    title: "Spreadsheet-native control",
    description: "Keep the grid mental model while centralizing formulas, permissions, and version awareness.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready collaboration",
    description: "Track workbook ownership, approvals, and live changes without passing files around.",
  },
  {
    icon: Sparkles,
    title: "Planning system, not a file share",
    description: "Turn fragmented budgets into structured workflows for finance, ops, and department leads.",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="absolute inset-0 -z-10 bg-hero-radial" />
      <div className="absolute left-[8%] top-24 -z-10 size-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute bottom-8 right-[10%] -z-10 size-80 animate-float rounded-full bg-emerald-200/35 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <Badge className="w-fit" variant="secondary">
            Hackathon scaffold ready for MVP delivery
          </Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Financial planning without the spreadsheet chaos.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700">
              A production-grade starting point for a web-first FP&amp;A platform with shared models, role-aware workflows,
              and a premium operator experience.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                Launch Workspace
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">View Product Shell</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {valueProps.map((item) => (
              <div className="rounded-3xl border border-white/50 bg-white/35 p-5 backdrop-blur" key={item.title}>
                <item.icon className="mb-4 size-5 text-slate-900" />
                <p className="mb-2 font-medium text-slate-950">{item.title}</p>
                <p className="text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b border-white/60 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Live plan review</p>
                  <h2 className="text-2xl font-semibold text-slate-950">FY27 Operating Plan</h2>
                </div>
                <Badge variant="success">Realtime</Badge>
              </div>
              <div className="grid gap-3">
                {[
                  ["Revenue", "$1.66M", "-3.2% vs plan"],
                  ["Gross Margin", "$911K", "-2.9% vs plan"],
                  ["Hiring Pace", "84%", "4 open reqs blocked"],
                ].map(([label, value, meta]) => (
                  <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3" key={label}>
                    <div>
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="font-medium text-slate-950">{value}</p>
                    </div>
                    <p className="text-sm text-slate-600">{meta}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 bg-slate-950 px-6 py-8 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Review queue</p>
                <p className="text-sm text-white/60">7 active</p>
              </div>
              <div className="space-y-3">
                {[
                  "Department submissions synced to a shared model",
                  "Version-aware assumptions preserved at cell level",
                  "Executive dashboard updates without manual copy-paste",
                ].map((item) => (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

