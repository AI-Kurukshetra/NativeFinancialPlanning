import { ModelingStudio } from "@/components/app/modeling-studio";
import { AppTopbar } from "@/components/shell/app-topbar";
import { getModelingPageData } from "@/lib/server/app-data";

export default async function ModelingPage() {
  const data = await getModelingPageData();

  return (
    <div className="space-y-6">
      <AppTopbar
        title="Modeling"
        subtitle="Scenarios, dimensions, account structure, and variance registers"
      />
      <ModelingStudio data={data} />
    </div>
  );
}
