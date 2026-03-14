import { AppTopbar } from "@/components/shell/app-topbar";
import { IntegrationHub } from "@/components/app/integration-hub";
import { getIntegrationsPageData } from "@/lib/server/app-data";

export default async function IntegrationsPage() {
  const data = await getIntegrationsPageData();

  return (
    <div className="space-y-6">
      <AppTopbar
        subtitle="External source registration for imports, sync jobs, and centralized finance data"
        title="Integrations"
      />
      <IntegrationHub items={data.items} />
    </div>
  );
}
