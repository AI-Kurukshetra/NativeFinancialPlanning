import { AppTopbar } from "@/components/shell/app-topbar";
import { TemplateLibrary } from "@/components/app/template-library";
import { getTemplatesPageData } from "@/lib/server/app-data";

export default async function TemplatesPage() {
  const data = await getTemplatesPageData();

  return (
    <div className="space-y-6">
      <AppTopbar
        subtitle="Reusable workbook blueprints and planning pack starters"
        title="Templates"
      />
      <TemplateLibrary items={data.items} />
    </div>
  );
}
