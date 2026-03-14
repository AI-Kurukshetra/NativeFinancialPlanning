import { NewWorkbookForm } from "@/components/app/new-workbook-form";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewWorkbookPage() {
  return (
    <div className="space-y-6">
      <AppTopbar title="New Workbook" subtitle="Create a new workbook from templates or start from scratch" />
      <Card>
        <CardHeader>
          <CardTitle>Create a workbook</CardTitle>
          <CardDescription>Start from scratch with a live workbook persisted in Supabase and ready for collaborative editing.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewWorkbookForm />
        </CardContent>
      </Card>
    </div>
  );
}
