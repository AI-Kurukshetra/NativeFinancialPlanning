import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewWorkbookPage() {
  return (
    <div className="space-y-6">
      <AppTopbar title="New Workbook" subtitle="Scaffold placeholder for workbook creation and template selection" />
      <Card>
        <CardHeader>
          <CardTitle>Template-driven creation flow</CardTitle>
          <CardDescription>Next implementation step: create workbook metadata, seed worksheets, and attach role defaults.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-7 text-slate-600">
          This page is intentionally scaffolded only. The route exists so product work can connect form handling, validation, and server actions without reorganizing the app later.
        </CardContent>
      </Card>
    </div>
  );
}

