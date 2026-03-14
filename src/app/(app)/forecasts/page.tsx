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
      <div className="grid min-h-[600px] auto-rows-fr gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Create forecast</CardTitle>
            <CardDescription>Spin up a rolling forecast attached to a workbook and planning horizon.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <PlanningCreateForm endpoint="/api/forecasts" extraFields="forecast" submitLabel="Create forecast" title="Forecast" workbookOptions={workbooks} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Forecast register</CardTitle>
            <CardDescription>Current forecast structures in the active workspace, with inline edit and delete support.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[800px]">
            <PlanningRegister
              description=""
              items={items}
              kind="forecast"
              title=""
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
