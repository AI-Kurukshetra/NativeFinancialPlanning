import type { SupabaseClient } from "@supabase/supabase-js";
import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import { requireApiAccess, apiError } from "@/lib/api/route-helpers";
import { persistCellsSchema } from "@/lib/schemas/cells";

type WorksheetRow = {
  id: string;
  workbook_id: string;
  name: string;
  position: number;
};

type CellRow = {
  id: string;
  worksheet_id: string;
  row_index: number;
  column_index: number;
  raw_value: string | null;
  display_value: string | null;
  formula: string | null;
  value_type: string;
  format: Record<string, unknown>;
  metadata: Record<string, unknown>;
  updated_at: string;
};

async function getWorksheet(
  worksheetId: string,
  supabase: SupabaseClient,
) {
  return supabase
    .from("worksheets")
    .select("id, workbook_id, name, position")
    .eq("id", worksheetId)
    .maybeSingle<WorksheetRow>();
}

export async function GET(request: NextRequest) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const worksheetId = request.nextUrl.searchParams.get("worksheetId");

  if (!worksheetId) {
    return apiError("worksheetId is required.", 400);
  }

  const worksheetResult = await getWorksheet(worksheetId, access.supabase);

  if (worksheetResult.error) {
    return apiError(worksheetResult.error.message, 500);
  }

  if (!worksheetResult.data) {
    return apiError("Worksheet not found.", 404);
  }

  const cellsResult = await access.supabase
    .from("cell_data")
    .select("id, worksheet_id, row_index, column_index, raw_value, display_value, formula, value_type, format, metadata, updated_at")
    .eq("worksheet_id", worksheetId)
    .order("row_index", { ascending: true })
    .order("column_index", { ascending: true })
    .returns<CellRow[]>();

  if (cellsResult.error) {
    return apiError(cellsResult.error.message, 500);
  }

  return NextResponse.json({
    data: {
      worksheet: worksheetResult.data,
      cells: cellsResult.data ?? [],
    },
  });
}

export async function POST(request: NextRequest) {
  const access = await requireApiAccess(["admin", "editor"]);

  if ("response" in access) {
    return access.response;
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = persistCellsSchema.parse(payload);
    const worksheetResult = await getWorksheet(input.worksheetId, access.supabase);

    if (worksheetResult.error) {
      return apiError(worksheetResult.error.message, 500);
    }

    if (!worksheetResult.data) {
      return apiError("Worksheet not found.", 404);
    }

    const upserts = input.cells
      .filter((cell) => !cell.clear)
      .map((cell) => ({
        worksheet_id: input.worksheetId,
        row_index: cell.rowIndex,
        column_index: cell.columnIndex,
        raw_value: cell.rawValue ?? null,
        display_value: cell.displayValue ?? null,
        formula: cell.formula ?? null,
        value_type: cell.valueType ?? (cell.formula ? "formula" : "text"),
        format: cell.format ?? {},
        metadata: {
          ...cell.metadata,
          updatedVia: "api",
        },
        updated_by: access.workspace.user.id,
      }));
    const clears = input.cells.filter((cell) => cell.clear);

    if (upserts.length > 0) {
      const upsertResult = await access.supabase.from("cell_data").upsert(upserts, {
        onConflict: "worksheet_id,row_index,column_index",
      });

      if (upsertResult.error) {
        return apiError(upsertResult.error.message, 500);
      }
    }

    if (clears.length > 0) {
      const clearFilter = clears
        .map(
          (cell) =>
            `and(row_index.eq.${cell.rowIndex},column_index.eq.${cell.columnIndex})`,
        )
        .join(",");

      const clearResult = await access.supabase
        .from("cell_data")
        .delete()
        .eq("worksheet_id", input.worksheetId)
        .or(clearFilter);

      if (clearResult.error) {
        return apiError(clearResult.error.message, 500);
      }
    }

    const cellsResult = await access.supabase
      .from("cell_data")
      .select("id, worksheet_id, row_index, column_index, raw_value, display_value, formula, value_type, format, metadata, updated_at")
      .eq("worksheet_id", input.worksheetId)
      .order("row_index", { ascending: true })
      .order("column_index", { ascending: true })
      .returns<CellRow[]>();

    if (cellsResult.error) {
      return apiError(cellsResult.error.message, 500);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "cell_data",
      entityId: input.worksheetId,
      action: "cells_persisted",
      details: {
        worksheetId: input.worksheetId,
        upserted: upserts.length,
        cleared: clears.length,
      },
    });

    return NextResponse.json({
      data: {
        worksheet: worksheetResult.data,
        upserted: upserts.length,
        cleared: clears.length,
        cells: cellsResult.data ?? [],
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid cell payload.", 400);
    }

    return apiError("Unexpected cell persistence error.", 500);
  }
}
