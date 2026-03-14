import { PlanningCreateForm } from "@/components/app/planning-create-form";
import { WorkflowBoard } from "@/components/app/workflow-board";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkflowsPageData } from "@/lib/server/app-data";

export default async function WorkflowsPage() {
  const { items, workbooks, currentUserId, approverChoices } = await getWorkflowsPageData();

  return (
    <div className="space-y-6">
      <AppTopbar title="Workflows" subtitle="Approval routing, reviewer ownership, and workflow state transitions" />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create workflow</CardTitle>
            <CardDescription>Set up a review workflow tied to a workbook and current approval step.</CardDescription>
          </CardHeader>
          <CardContent>
            <PlanningCreateForm endpoint="/api/workflows" extraFields="workflow" peopleOptions={approverChoices} submitLabel="Create workflow" title="Workflow" workbookOptions={workbooks} />
          </CardContent>
        </Card>

        <WorkflowBoard currentUserId={currentUserId} items={items} />
      </div>
    </div>
  );
}
