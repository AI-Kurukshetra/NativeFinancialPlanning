import { ZodError } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import { apiError, requireApiAccess } from "@/lib/api/route-helpers";
import { updateWorksheetSchema } from "@/lib/schemas/workbooks";

type WorksheetRow = {
  id: string;
  workbook_id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
};

async function getWorksheet(
  worksheetId: string,
  workbookId: string,
  supabase: SupabaseClient,
) {
  return supabase
    .from("worksheets")
    .select("id, workbook_id, name, position, created_at, updated_at")
    .eq("id", worksheetId)
    .eq("workbook_id", workbookId)
    .maybeSingle<WorksheetRow>();
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; worksheetId: string }> },
) {
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
    const input = updateWorksheetSchema.parse(payload);
    const { id, worksheetId } = await params;
    const worksheetResult = await getWorksheet(worksheetId, id, access.supabase);

    if (worksheetResult.error) {
      return apiError(worksheetResult.error.message, 500);
    }

    if (!worksheetResult.data) {
      return apiError("Worksheet not found.", 404);
    }

    const updateResult = await access.supabase
      .from("worksheets")
      .update({
        name: input.name,
      })
      .eq("id", worksheetId)
      .eq("workbook_id", id)
      .select("id, workbook_id, name, position, created_at, updated_at")
      .maybeSingle<WorksheetRow>();

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "worksheets",
      entityId: worksheetId,
      action: "worksheet_updated",
      details: {
        workbookId: id,
        previousName: worksheetResult.data.name,
        name: input.name,
      },
    });

    return NextResponse.json({ data: updateResult.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid worksheet payload.", 400);
    }

    return apiError("Unexpected worksheet update error.", 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; worksheetId: string }> },
) {
  const access = await requireApiAccess(["admin", "editor"]);

  if ("response" in access) {
    return access.response;
  }

  const { id, worksheetId } = await params;
  const worksheetResult = await getWorksheet(worksheetId, id, access.supabase);

  if (worksheetResult.error) {
    return apiError(worksheetResult.error.message, 500);
  }

  if (!worksheetResult.data) {
    return apiError("Worksheet not found.", 404);
  }

  const countResult = await access.supabase
    .from("worksheets")
    .select("*", { count: "exact", head: true })
    .eq("workbook_id", id);

  if (countResult.error) {
    return apiError(countResult.error.message, 500);
  }

  if ((countResult.count ?? 0) <= 1) {
    return apiError("A workbook must keep at least one worksheet.", 400);
  }

  const deleteResult = await access.supabase
    .from("worksheets")
    .delete()
    .eq("id", worksheetId)
    .eq("workbook_id", id);

  if (deleteResult.error) {
    return apiError(deleteResult.error.message, 500);
  }

  await logAuditEvent(access.supabase, {
    organizationId: access.workspace.organization.id,
    actorId: access.workspace.user.id,
    entityType: "worksheets",
    entityId: worksheetId,
    action: "worksheet_deleted",
    details: {
      workbookId: id,
      name: worksheetResult.data.name,
      position: worksheetResult.data.position,
    },
  });

  return NextResponse.json({ data: { id: worksheetId, deleted: true } });
}
