import { ZodError } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import { apiError, requireApiAccess } from "@/lib/api/route-helpers";
import { createWorksheetSchema } from "@/lib/schemas/workbooks";

type WorkbookRow = {
  id: string;
  name: string;
};

type WorksheetRow = {
  id: string;
  workbook_id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
};

async function getWorkbook(
  workbookId: string,
  organizationId: string,
  supabase: SupabaseClient,
) {
  return supabase
    .from("workbooks")
    .select("id, name")
    .eq("id", workbookId)
    .eq("organization_id", organizationId)
    .maybeSingle<WorkbookRow>();
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
    const input = createWorksheetSchema.parse(payload);
    const { id } = await params;
    const workbookResult = await getWorkbook(
      id,
      access.workspace.organization.id,
      access.supabase,
    );

    if (workbookResult.error) {
      return apiError(workbookResult.error.message, 500);
    }

    if (!workbookResult.data) {
      return apiError("Workbook not found.", 404);
    }

    const positionResult = await access.supabase
      .from("worksheets")
      .select("position")
      .eq("workbook_id", id)
      .order("position", { ascending: false })
      .limit(1)
      .returns<Array<{ position: number }>>();

    if (positionResult.error) {
      return apiError(positionResult.error.message, 500);
    }

    const nextPosition = (positionResult.data?.[0]?.position ?? -1) + 1;
    const worksheetResult = await access.supabase
      .from("worksheets")
      .insert({
        workbook_id: id,
        created_by: access.workspace.user.id,
        name: input.name,
        position: nextPosition,
      })
      .select("id, workbook_id, name, position, created_at, updated_at")
      .maybeSingle<WorksheetRow>();

    if (worksheetResult.error) {
      return apiError(worksheetResult.error.message, 500);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "worksheets",
      entityId: worksheetResult.data?.id ?? null,
      action: "worksheet_created",
      details: {
        workbookId: id,
        workbookName: workbookResult.data.name,
        name: input.name,
        position: nextPosition,
      },
    });

    return NextResponse.json({ data: worksheetResult.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid worksheet payload.", 400);
    }

    return apiError("Unexpected worksheet creation error.", 500);
  }
}
