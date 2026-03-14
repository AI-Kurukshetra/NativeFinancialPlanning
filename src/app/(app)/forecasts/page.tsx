import { PlanningCreateForm } from "@/components/app/planning-create-form";
import { PlanningRegister } from "@/components/app/planning-register";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getForecastsPageData } from "@/lib/server/app-data";

export default async function ForecastsPage() {
  const { items, workbooks } = await getForecastsPageData();

  return (
    <div className="space-y-6">
      <AppTopbar title="Forecasts" subtitle="Rolling outlooks, scenario windows, and confidence tracking" />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create forecast</CardTitle>
            <CardDescription>Spin up a rolling forecast attached to a workbook and planning horizon.</CardDescription>
          </CardHeader>
          <CardContent>
            <PlanningCreateForm endpoint="/api/forecasts" extraFields="forecast" submitLabel="Create forecast" title="Forecast" workbookOptions={workbooks} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <PlanningRegister
              description="Current forecast structures in the active workspace, with inline edit and delete support."
              items={items}
              kind="forecast"
              title="Forecast register"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
