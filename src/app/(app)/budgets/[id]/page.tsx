import { notFound } from "next/navigation";

import { PlanningDetailView } from "@/components/app/planning-detail-view";
import { AppTopbar } from "@/components/shell/app-topbar";
import { getBudgetDetailPageData } from "@/lib/server/app-data";

export default async function BudgetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getBudgetDetailPageData(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AppTopbar
        title={data.item.name}
        subtitle="Budget execution, scenario pressure, and live workbook context"
      />
      <PlanningDetailView data={data} />
    </div>
  );
}
