import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import {
  getWorkbookSnapshot,
  type WorkbookSnapshot,
} from "@/lib/api/workbook-snapshots";
import { apiError, parseJsonBody, requireApiAccess } from "@/lib/api/route-helpers";
import { exportWorkbookSchema } from "@/lib/schemas/resources";

function toCsvRow(values: string[]) {
  return values
    .map((value) => `"${value.replaceAll('"', '""')}"`)
    .join(",");
}

function workbookToCsvFiles(snapshot: WorkbookSnapshot) {
  return snapshot.worksheets.map((worksheet) => {
    const maxRow = worksheet.cells.reduce(
      (current, cell) => Math.max(current, cell.row_index),
      0,
    );
    const maxColumn = worksheet.cells.reduce(
      (current, cell) => Math.max(current, cell.column_index),
      0,
    );
    const cellMap = new Map(
      worksheet.cells.map((cell) => [
        `${cell.row_index}:${cell.column_index}`,
        cell.formula ?? cell.display_value ?? cell.raw_value ?? "",
      ]),
    );
    const rows = Array.from({ length: maxRow }, (_, rowOffset) =>
      toCsvRow(
        Array.from({ length: maxColumn }, (_, columnOffset) => {
          return (
            cellMap.get(`${rowOffset + 1}:${columnOffset + 1}`) ?? ""
          );
        }),
      ),
    );

    return {
      filename: `${snapshot.workbook.name}-${worksheet.name}.csv`,
      mimeType: "text/csv",
      content: rows.join("\n"),
    };
  });
}

export async function POST(request: NextRequest) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = exportWorkbookSchema.parse(payload);
    const snapshotResult = await getWorkbookSnapshot(
      access.supabase,
      access.workspace.organization.id,
      input.workbookId,
    );

    if (snapshotResult.error) {
      return apiError(snapshotResult.error, 500);
    }

    const snapshot = snapshotResult.data;

    if (!snapshot) {
      return apiError("Workbook snapshot could not be generated.", 500);
    }

    const files =
      input.format === "json"
        ? [
            {
              filename: `${snapshot.workbook.name}.json`,
              mimeType: "application/json",
              content: JSON.stringify(snapshot, null, 2),
            },
          ]
        : workbookToCsvFiles(snapshot);

    return NextResponse.json({
      data: {
        format: input.format,
        workbookId: input.workbookId,
        files,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid export payload.", 400);
    }

    return apiError("Unexpected export error.", 500);
  }
}
