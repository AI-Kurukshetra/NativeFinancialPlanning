import { notFound } from "next/navigation";

import { PlanningDetailView } from "@/components/app/planning-detail-view";
import { AppTopbar } from "@/components/shell/app-topbar";
import { getForecastDetailPageData } from "@/lib/server/app-data";

export default async function ForecastDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getForecastDetailPageData(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AppTopbar
        title={data.item.name}
        subtitle="Forecast confidence, what-if movement, and live model coverage"
      />
      <PlanningDetailView data={data} />
    </div>
  );
}
