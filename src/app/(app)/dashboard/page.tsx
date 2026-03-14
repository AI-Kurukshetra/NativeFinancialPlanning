import { dashboardMetrics, workbooks } from "@/lib/data/mock-data";
import { formatCurrency } from "@/lib/utils";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <AppTopbar title="Dashboard" subtitle="Executive visibility for the active planning cycle" />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Plan health snapshot</CardTitle>
            <CardDescription>Mock data placeholder for variance charts and contribution bridges.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Revenue", 1664000, "94% synced"],
              ["Opex", 615700, "11 pending reviews"],
              ["Headcount", 142, "3 open approvals"],
            ].map(([label, value, meta]) => (
              <div className="rounded-2xl bg-white/70 p-4" key={label as string}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium text-slate-900">{label}</p>
                  <p className="text-sm text-slate-500">{meta}</p>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-slate-900" style={{ width: label === "Revenue" ? "78%" : label === "Opex" ? "62%" : "84%" }} />
                </div>
                <p className="mt-3 text-sm text-slate-600">{typeof value === "number" ? formatCurrency(value) : value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active workstreams</CardTitle>
            <CardDescription>Fast summary of the workbooks most likely to block publishing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {workbooks.map((workbook) => (
              <div className="rounded-2xl bg-white/70 p-4" key={workbook.id}>
                <p className="font-medium text-slate-950">{workbook.name}</p>
                <p className="mt-1 text-sm text-slate-600">{workbook.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

