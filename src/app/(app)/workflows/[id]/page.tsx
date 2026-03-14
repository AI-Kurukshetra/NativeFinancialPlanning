import { notFound } from "next/navigation";

import { WorkflowDetailView } from "@/components/app/workflow-detail-view";
import { AppTopbar } from "@/components/shell/app-topbar";
import { getWorkflowDetailPageData } from "@/lib/server/app-data";

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getWorkflowDetailPageData(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AppTopbar
        title={data.workflow.name}
        subtitle="Approval detail, reviewer progression, and linked model context"
      />
      <WorkflowDetailView data={data} />
    </div>
  );
}
