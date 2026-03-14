import { BarChart3, Database, FileSpreadsheet, LockKeyhole, MessageSquareMore, RefreshCcw } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileSpreadsheet,
    title: "Workbook-native modeling",
    description: "Structure planning cycles around workbooks, worksheets, formulas, and scenario assumptions.",
  },
  {
    icon: Database,
    title: "Centralized cloud data",
    description: "Move out of email attachments into a source-of-truth data model designed for finance teams.",
  },
  {
    icon: RefreshCcw,
    title: "Realtime collaboration",
    description: "Let operators, approvers, and executives work from the same workbook without version drift.",
  },
  {
    icon: LockKeyhole,
    title: "Role-based control",
    description: "Define who can edit, review, publish, and export across organization-scoped workspaces.",
  },
  {
    icon: MessageSquareMore,
    title: "Commentary and review loops",
    description: "Anchor context to the plan so budget conversations stay attached to the numbers.",
  },
  {
    icon: BarChart3,
    title: "Executive visibility",
    description: "Surface forecast health, plan variance, and cycle throughput in a dashboard-ready shell.",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Platform baseline</p>
        <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Everything needed to start building the MVP properly.</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <feature.icon className="size-5" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-6 text-slate-600">
              This scaffold wires the route structure, shared utilities, and API surface so product work can start from a credible base.
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

