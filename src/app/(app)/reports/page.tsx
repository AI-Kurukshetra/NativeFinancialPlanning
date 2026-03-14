import { PlanningCreateForm } from "@/components/app/planning-create-form";
import { ReportingStudio } from "@/components/app/reporting-studio";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getReportsPageData } from "@/lib/server/app-data";

export default async function ReportsPage() {
  const { items, workbooks, schedules } = await getReportsPageData();

  return (
    <div className="space-y-6">
      <AppTopbar title="Reports" subtitle="Exports, reporting views, and communication artifacts" />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create report</CardTitle>
            <CardDescription>Persist a reporting definition and link it to a workbook for export and publishing flows.</CardDescription>
          </CardHeader>
          <CardContent>
            <PlanningCreateForm endpoint="/api/reports" extraFields="report" submitLabel="Create report" title="Report" workbookOptions={workbooks} />
          </CardContent>
        </Card>

        <ReportingStudio reports={items} schedules={schedules} />
      </div>
    </div>
  );
}
