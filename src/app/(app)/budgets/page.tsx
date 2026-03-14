import { PlanningCreateForm } from "@/components/app/planning-create-form";
import { PlanningRegister } from "@/components/app/planning-register";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBudgetsPageData } from "@/lib/server/app-data";

export default async function BudgetsPage() {
  const { items, workbooks } = await getBudgetsPageData();

  return (
    <div className="space-y-6">
      <AppTopbar title="Budgets" subtitle="Planning structures, review readiness, and variance tracking" />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create budget</CardTitle>
            <CardDescription>Create a live planning object tied to a workbook and stored in the active organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <PlanningCreateForm endpoint="/api/budgets" extraFields="budget" submitLabel="Create budget" title="Budget" workbookOptions={workbooks} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <PlanningRegister
              description="Recent budget structures available to the active workspace, with inline lifecycle controls."
              items={items}
              kind="budget"
              title="Budget register"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
