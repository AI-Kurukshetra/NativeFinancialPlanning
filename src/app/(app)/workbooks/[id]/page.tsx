import { notFound } from "next/navigation";

import { WorkbookWorkspace } from "@/components/app/workbook-workspace";
import { AppTopbar } from "@/components/shell/app-topbar";
import { getWorkbookDetailItem } from "@/lib/server/app-data";
import { getCurrentWorkspaceContext } from "@/lib/supabase/current-user";

export default async function WorkbookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [workbook, context] = await Promise.all([
    getWorkbookDetailItem(id),
    getCurrentWorkspaceContext(),
  ]);

  if (!workbook) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AppTopbar title={workbook.name} subtitle="Workbook workspace for collaborative financial modeling" />
      <WorkbookWorkspace
        currentUserId={context.user?.id ?? null}
        currentUserRole={context.membership?.role ?? null}
        workbook={workbook}
      />
    </div>
  );
}
