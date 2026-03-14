import { AnalyticsOverview } from "@/components/app/analytics-overview";
import { AppTopbar } from "@/components/shell/app-topbar";
import { getAnalyticsPageData } from "@/lib/server/app-data";

export default async function AnalyticsPage() {
  const data = await getAnalyticsPageData();

  return (
    <div className="space-y-6">
      <AppTopbar
        title="Analytics"
        subtitle="KPI health, dimension coverage, and variance visibility"
      />
      <AnalyticsOverview data={data} />
    </div>
  );
}
