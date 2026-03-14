import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import { requireApiAccess, apiError } from "@/lib/api/route-helpers";
import { importWorkbookSchema } from "@/lib/schemas/imports";

type WorkbookRow = {
  id: string;
  name: string;
  description: string;
  status: string;
  updated_at: string;
};

type WorksheetRow = {
  id: string;
  workbook_id: string;
  name: string;
  position: number;
};

type ImportValue = string | number | boolean | null;

function toCellPayload(
  value: ImportValue,
  rowIndex: number,
  columnIndex: number,
  userId: string,
) {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value === "string" && value.startsWith("=")) {
    return {
      worksheet_id: "",
      row_index: rowIndex,
      column_index: columnIndex,
      raw_value: value,
      display_value: null,
      formula: value,
      value_type: "formula",
      format: {},
      metadata: {
        imported: true,
      },
      updated_by: userId,
    };
  }

  return {
    worksheet_id: "",
    row_index: rowIndex,
    column_index: columnIndex,
    raw_value: String(value),
    display_value: String(value),
    formula: null,
    value_type:
      typeof value === "number"
        ? "number"
        : typeof value === "boolean"
          ? "boolean"
          : "text",
    format: {},
    metadata: {
      imported: true,
    },
    updated_by: userId,
  };
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
    const input = importWorkbookSchema.parse(payload);

    const workbookResult = await access.supabase
      .from("workbooks")
      .insert({
        organization_id: access.workspace.organization.id,
        created_by: access.workspace.user.id,
        name: input.workbookName,
        description: input.description,
        status: input.status,
      })
      .select("id, name, description, status, updated_at")
      .maybeSingle<WorkbookRow>();

    if (workbookResult.error) {
      return apiError(workbookResult.error.message, 500);
    }

    if (!workbookResult.data) {
      return apiError("Workbook import returned no workbook row.", 500);
    }

    const worksheetResult = await access.supabase
      .from("worksheets")
      .insert({
        workbook_id: workbookResult.data.id,
        created_by: access.workspace.user.id,
        name: input.worksheetName,
        position: 0,
      })
      .select("id, workbook_id, name, position")
      .maybeSingle<WorksheetRow>();

    if (worksheetResult.error) {
      return apiError(worksheetResult.error.message, 500);
    }

    if (!worksheetResult.data) {
      return apiError("Workbook import returned no worksheet row.", 500);
    }

    const worksheetId = worksheetResult.data.id;
    const cells = input.rows.flatMap((row, rowIndex) =>
      row
        .map((value, columnIndex) =>
          toCellPayload(
            value,
            rowIndex + 1,
            columnIndex + 1,
            access.workspace.user.id,
          ),
        )
        .filter((cell): cell is NonNullable<typeof cell> => cell !== null)
        .map((cell) => ({
          ...cell,
          worksheet_id: worksheetId,
        })),
    );

    if (cells.length > 0) {
      const cellsResult = await access.supabase.from("cell_data").insert(cells);

      if (cellsResult.error) {
        return apiError(cellsResult.error.message, 500);
      }
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "workbooks",
      entityId: workbookResult.data.id,
      action: "workbook_imported",
      details: {
        worksheetId: worksheetId,
        importedCellCount: cells.length,
        importedRowCount: input.rows.length,
      },
    });

    return NextResponse.json(
      {
        data: {
          workbook: workbookResult.data,
          worksheet: worksheetResult.data,
          importedCellCount: cells.length,
          importedRowCount: input.rows.length,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid import payload.", 400);
    }

    return apiError("Unexpected import error.", 500);
  }
}
