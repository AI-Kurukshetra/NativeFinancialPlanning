import { ImportWorkbookForm } from "@/components/app/import-workbook-form";
import Link from "next/link";

import { WorkbookGrid } from "@/components/workbooks/workbook-grid";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkbookPageItems } from "@/lib/server/app-data";

export default async function WorkbooksPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const [workbooks, params] = await Promise.all([getWorkbookPageItems(), searchParams]);
  const query = params?.query?.trim().toLowerCase() ?? "";
  const filteredWorkbooks =
    query.length === 0
      ? workbooks
      : workbooks.filter((workbook) =>
          [workbook.name, workbook.description, workbook.owner]
            .join(" ")
            .toLowerCase()
            .includes(query),
        );

  return (
    <div className="space-y-6">
      <AppTopbar title="Workbooks" subtitle="Shared models, scenario planning, and spreadsheet-native operations" />
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/workbooks/new">New Workbook</Link>
        </Button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {query.length > 0 ? (
            <div className="rounded-[24px] border border-black/10 bg-white/70 px-4 py-3 text-sm text-slate-600">
              Showing results for <span className="font-medium text-slate-950">{query}</span>
            </div>
          ) : null}
          {filteredWorkbooks.length > 0 ? (
            <WorkbookGrid items={filteredWorkbooks} />
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/60 bg-white/45 p-8 text-sm text-slate-600">
              {query.length > 0
                ? "No workbooks matched the current search."
                : "No workbooks yet. Create the first workbook to begin planning in the shared workspace."}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import workbook</CardTitle>
            <CardDescription>
              Paste tabular data directly into the platform to bootstrap a workbook,
              worksheet, and persisted cell grid in one step.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImportWorkbookForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
