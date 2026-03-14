import { budgetLines } from "@/lib/data/mock-data";
import { formatCurrency } from "@/lib/utils";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <AppTopbar title="Budgets" subtitle="Planning structures, review readiness, and variance tracking" />
      <Card>
        <CardHeader>
          <CardTitle>Budget snapshot</CardTitle>
          <CardDescription>Mock variance table that will later bind to organization and workbook data.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-3xl border border-white/55">
          <div className="grid grid-cols-4 bg-slate-950 px-5 py-3 text-sm font-medium text-white">
            <div>Line</div>
            <div>Plan</div>
            <div>Actual</div>
            <div>Variance</div>
          </div>
          {budgetLines.map((line) => (
            <div className="grid grid-cols-4 border-t border-white/55 bg-white/75 px-5 py-4 text-sm text-slate-700" key={line.name}>
              <div className="font-medium text-slate-900">{line.name}</div>
              <div>{formatCurrency(line.plan)}</div>
              <div>{formatCurrency(line.actual)}</div>
              <div className={line.variance < 0 ? "text-rose-600" : "text-emerald-700"}>{formatCurrency(line.variance)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

