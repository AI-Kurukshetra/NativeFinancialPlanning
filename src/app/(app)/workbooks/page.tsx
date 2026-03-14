import Link from "next/link";

import { workbooks } from "@/lib/data/mock-data";
import { WorkbookGrid } from "@/components/workbooks/workbook-grid";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Button } from "@/components/ui/button";

export default function WorkbooksPage() {
  return (
    <div className="space-y-6">
      <AppTopbar title="Workbooks" subtitle="Shared models, scenario planning, and spreadsheet-native operations" />
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/workbooks/new">New Workbook</Link>
        </Button>
      </div>
      <WorkbookGrid items={workbooks} />
    </div>
  );
}
