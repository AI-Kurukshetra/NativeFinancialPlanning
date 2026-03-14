import { SearchResults } from "@/components/app/search-results";
import { AppTopbar } from "@/components/shell/app-topbar";
import { getSearchPageData } from "@/lib/server/app-data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const data = await getSearchPageData(params?.query ?? "");

  return (
    <div className="space-y-6">
      <AppTopbar
        title="Search"
        subtitle="Cross-workspace lookup for workbooks, reports, workflows, templates, and integrations"
      />
      <SearchResults data={data} />
    </div>
  );
}
