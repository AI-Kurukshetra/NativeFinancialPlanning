import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SearchPageData } from "@/lib/server/app-data";

type SearchResultsProps = {
  data: SearchPageData;
};

function getVariant(type: SearchPageData["results"][number]["type"]) {
  if (type === "workbook") {
    return "success" as const;
  }

  if (type === "report" || type === "workflow") {
    return "warning" as const;
  }

  return "secondary" as const;
}

export function SearchResults({ data }: SearchResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Results</CardTitle>
        <CardDescription>
          {data.query
            ? `${data.results.length} result(s) for "${data.query}"`
            : "Enter a query from the top search bar to explore workbooks, reports, workflows, templates, and integrations."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.query.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-black/12 bg-white/55 p-6 text-sm text-slate-600">
            Try searching for workbook names, owner names, workflow steps, or template categories.
          </div>
        ) : data.results.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-black/12 bg-white/55 p-6 text-sm text-slate-600">
            No matching items were found in the active workspace.
          </div>
        ) : (
          data.results.map((result) => (
            <div className="rounded-[26px] border border-white/55 bg-white/75 p-5" key={`${result.type}-${result.id}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-slate-950">{result.title}</p>
                    <Badge variant={getVariant(result.type)}>{result.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{result.description || "No description available."}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {result.metadata}
                  </p>
                </div>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-black/12 bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-50"
                  href={result.href}
                >
                  Open
                </Link>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
