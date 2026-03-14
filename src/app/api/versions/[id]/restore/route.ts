import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import { apiError, requireApiAccess } from "@/lib/api/route-helpers";

type VersionRow = {
  id: string;
  organization_id: string;
  workbook_id: string;
  label: string;
  snapshot: {
    workbook?: {
      name?: string;
      description?: string;
      status?: string;
    };
    worksheets?: Array<{
      name: string;
      position: number;
      cells?: Array<{
        row_index: number;
        column_index: number;
        raw_value: string | null;
        display_value: string | null;
        formula: string | null;
        value_type: string;
        format: Record<string, unknown>;
        metadata: Record<string, unknown>;
      }>;
    }>;
  };
};

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess(["admin", "editor"]);

  if ("response" in access) {
    return access.response;
  }

  const { id } = await params;
  const versionResult = await access.supabase
    .from("versions")
    .select("id, organization_id, workbook_id, label, snapshot")
    .eq("id", id)
    .eq("organization_id", access.workspace.organization.id)
    .maybeSingle<VersionRow>();

  if (versionResult.error) {
    return apiError(versionResult.error.message, 500);
  }

  if (!versionResult.data) {
    return apiError("Version not found.", 404);
  }

  const snapshot = versionResult.data.snapshot;
  const worksheets = snapshot.worksheets ?? [];

  const workbookUpdateResult = await access.supabase
    .from("workbooks")
    .update({
      ...(snapshot.workbook?.name ? { name: snapshot.workbook.name } : {}),
      ...(snapshot.workbook?.description !== undefined
        ? { description: snapshot.workbook.description }
        : {}),
      ...(snapshot.workbook?.status ? { status: snapshot.workbook.status } : {}),
    })
    .eq("id", versionResult.data.workbook_id)
    .eq("organization_id", access.workspace.organization.id);

  if (workbookUpdateResult.error) {
    return apiError(workbookUpdateResult.error.message, 500);
  }

  const deleteWorksheetsResult = await access.supabase
    .from("worksheets")
    .delete()
    .eq("workbook_id", versionResult.data.workbook_id);

  if (deleteWorksheetsResult.error) {
    return apiError(deleteWorksheetsResult.error.message, 500);
  }

  for (const worksheet of worksheets) {
    const worksheetResult = await access.supabase
      .from("worksheets")
      .insert({
        workbook_id: versionResult.data.workbook_id,
        created_by: access.workspace.user.id,
        name: worksheet.name,
        position: worksheet.position,
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (worksheetResult.error) {
      return apiError(worksheetResult.error.message, 500);
    }

    if (!worksheetResult.data) {
      return apiError("Worksheet restore returned no row.", 500);
    }

    const restoredWorksheetId = worksheetResult.data.id;
    const cells = (worksheet.cells ?? []).map((cell) => ({
      worksheet_id: restoredWorksheetId,
      row_index: cell.row_index,
      column_index: cell.column_index,
      raw_value: cell.raw_value ?? null,
      display_value: cell.display_value ?? null,
      formula: cell.formula ?? null,
      value_type: cell.value_type,
      format: cell.format ?? {},
      metadata: cell.metadata ?? {},
      updated_by: access.workspace.user.id,
    }));

    if (cells.length > 0) {
      const cellsResult = await access.supabase.from("cell_data").insert(cells);

      if (cellsResult.error) {
        return apiError(cellsResult.error.message, 500);
      }
    }
  }

  await logAuditEvent(access.supabase, {
    organizationId: access.workspace.organization.id,
    actorId: access.workspace.user.id,
    entityType: "versions",
    entityId: id,
    action: "version_restored",
    details: {
      workbookId: versionResult.data.workbook_id,
      label: versionResult.data.label,
      worksheetCount: worksheets.length,
    },
  });

  return NextResponse.json({
    data: {
      versionId: id,
      workbookId: versionResult.data.workbook_id,
      restored: true,
    },
  });
}
