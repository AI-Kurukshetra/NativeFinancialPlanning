import { notFound } from "next/navigation";

import { workbooks } from "@/lib/data/mock-data";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function WorkbookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workbook = workbooks.find((item) => item.id === id);

  if (!workbook) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AppTopbar title={workbook.name} subtitle="Workbook detail route and grid workspace placeholder" />
      <Card>
        <CardHeader>
          <CardTitle>Spreadsheet workspace</CardTitle>
          <CardDescription>{workbook.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/60 bg-slate-200 text-sm sm:grid-cols-4">
            {Array.from({ length: 16 }, (_, index) => (
              <div className="bg-white/80 p-4 text-slate-700" key={index}>
                Cell {index + 1}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600">Next step: replace the placeholder grid with a persisted worksheet model and formula-aware editor.</p>
        </CardContent>
      </Card>
    </div>
  );
}

