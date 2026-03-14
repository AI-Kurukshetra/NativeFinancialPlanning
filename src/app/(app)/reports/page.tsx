import { FileDown, FileSpreadsheet, LayoutDashboard } from "lucide-react";

import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const reportCards = [
  {
    icon: LayoutDashboard,
    title: "Executive Summary",
    description: "Snapshot of forecast health, variance, and operating leverage.",
  },
  {
    icon: FileSpreadsheet,
    title: "Board Package",
    description: "Narrative-ready package with assumptions, bridges, and KPI rollups.",
  },
  {
    icon: FileDown,
    title: "Export Queue",
    description: "Reserved for CSV and XLSX generation jobs.",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <AppTopbar title="Reports" subtitle="Exports, reporting views, and communication artifacts" />
      <div className="grid gap-5 xl:grid-cols-3">
        {reportCards.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <item.icon className="size-5" />
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-slate-600">
              This route is wired for future reporting APIs and export jobs, without locking in the implementation prematurely.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

