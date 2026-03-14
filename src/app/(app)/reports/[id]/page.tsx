import { notFound } from "next/navigation";

import { ReportDetailView } from "@/components/app/report-detail-view";
import { AppTopbar } from "@/components/shell/app-topbar";
import { getReportDetailPageData } from "@/lib/server/app-data";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getReportDetailPageData(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AppTopbar
        title={data.report.name}
        subtitle="Immersive report preview, linked model coverage, and distribution detail"
      />
      <ReportDetailView data={data} />
    </div>
  );
}
