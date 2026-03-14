import Link from "next/link";

import type { WorkbookSummary } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function statusVariant(status: WorkbookSummary["status"]): "success" | "warning" | "secondary" {
  if (status === "published") return "success";
  if (status === "in_review") return "warning";
  return "secondary";
}

export function WorkbookGrid({ items }: { items: WorkbookSummary[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>
                  <Link className="transition-colors hover:text-slate-600" href={`/workbooks/${item.id}`}>
                    {item.name}
                  </Link>
                </CardTitle>
                <CardDescription className="mt-2 max-w-xl">{item.description}</CardDescription>
              </div>
              <Badge variant={statusVariant(item.status)}>{item.status.replace("_", " ")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <div>
                <p className="text-slate-400">Owner</p>
                <p className="font-medium text-slate-900">{item.owner}</p>
              </div>
              <div>
                <p className="text-slate-400">Collaborators</p>
                <p className="font-medium text-slate-900">{item.collaborators}</p>
              </div>
              <div>
                <p className="text-slate-400">Updated</p>
                <p className="font-medium text-slate-900">{new Date(item.updatedAt).toLocaleDateString("en-US")}</p>
              </div>
            </div>
            <Button asChild variant="secondary">
              <Link href={`/workbooks/${item.id}`}>Open Workbook</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
