import { AppTopbar } from "@/components/shell/app-topbar";
import { WorkspaceSettings } from "@/components/app/workspace-settings";
import { getWorkspacePageData } from "@/lib/server/app-data";

export default async function WorkspacePage() {
  const data = await getWorkspacePageData();

  return (
    <div className="space-y-6">
      <AppTopbar
        organizationName={data.context.organization?.name ?? "Workspace setup"}
        roleLabel={data.context.membership?.role ?? "member"}
        subtitle="Organization onboarding, membership context, and workspace selection"
        title="Workspace"
      />
      <WorkspaceSettings context={data.context} items={data.items} />
    </div>
  );
}
