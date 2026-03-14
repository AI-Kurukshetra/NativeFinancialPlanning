import type { SupabaseClient } from "@supabase/supabase-js";

type WorkbookRow = {
  id: string;
  organization_id: string;
  created_by: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type WorksheetRow = {
  id: string;
  workbook_id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
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

export type WorkbookSnapshot = {
  workbook: WorkbookRow;
  worksheets: Array<
    WorksheetRow & {
      cells: CellRow[];
    }
  >;
};

export async function getWorkbookSnapshot(
  supabase: SupabaseClient,
  organizationId: string,
  workbookId: string,
) {
  const workbookResult = await supabase
    .from("workbooks")
    .select(
      "id, organization_id, created_by, name, description, status, created_at, updated_at",
    )
    .eq("id", workbookId)
    .eq("organization_id", organizationId)
    .maybeSingle<WorkbookRow>();

  if (workbookResult.error) {
    return { error: workbookResult.error.message };
  }

  if (!workbookResult.data) {
    return { error: "Workbook not found." };
  }

  const worksheetsResult = await supabase
    .from("worksheets")
    .select("id, workbook_id, name, position, created_at, updated_at")
    .eq("workbook_id", workbookId)
    .order("position", { ascending: true })
    .returns<WorksheetRow[]>();

  if (worksheetsResult.error) {
    return { error: worksheetsResult.error.message };
  }

  const worksheetIds = (worksheetsResult.data ?? []).map((worksheet) => worksheet.id);
  const cellsResult =
    worksheetIds.length === 0
      ? { data: [] as CellRow[], error: null }
      : await supabase
          .from("cell_data")
          .select(
            "id, worksheet_id, row_index, column_index, raw_value, display_value, formula, value_type, format, metadata, updated_at",
          )
          .in("worksheet_id", worksheetIds)
          .order("row_index", { ascending: true })
          .order("column_index", { ascending: true })
          .returns<CellRow[]>();

  if (cellsResult.error) {
    return { error: cellsResult.error.message };
  }

  const cellsByWorksheet = new Map<string, CellRow[]>();

  for (const cell of cellsResult.data ?? []) {
    const existing = cellsByWorksheet.get(cell.worksheet_id);

    if (existing) {
      existing.push(cell);
    } else {
      cellsByWorksheet.set(cell.worksheet_id, [cell]);
    }
  }

  return {
    data: {
      workbook: workbookResult.data,
      worksheets: (worksheetsResult.data ?? []).map((worksheet) => ({
        ...worksheet,
        cells: cellsByWorksheet.get(worksheet.id) ?? [],
      })),
    } satisfies WorkbookSnapshot,
  };
}
