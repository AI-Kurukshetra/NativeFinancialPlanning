import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { reportUpdateSchema } from "@/lib/schemas/resources";

type ReportRow = {
  id: string;
  organization_id: string;
  workbook_id: string | null;
  created_by: string | null;
  name: string;
  status: string;
  definition: Record<string, unknown>;
  generated_at: string | null;
  created_at: string;
  updated_at: string;
};

async function getReport(
  id: string,
  organizationId: string,
  supabase: ApiSupabaseClient,
) {
  return supabase
    .from("reports")
    .select("id, organization_id, workbook_id, created_by, name, status, definition, generated_at, created_at, updated_at")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle<ReportRow>();
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const { id } = await params;
  const result = await getReport(id, access.workspace.organization.id, access.supabase);

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  if (!result.data) {
    return apiError("Report not found.", 404);
  }

  return NextResponse.json({ data: result.data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess(["admin", "editor", "approver"]);

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = reportUpdateSchema.parse(payload);
    const { id } = await params;

    const updateResult = await access.supabase
      .from("reports")
      .update({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.workbookId !== undefined ? { workbook_id: input.workbookId } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.definition !== undefined ? { definition: input.definition } : {}),
        ...(input.generatedAt !== undefined
          ? { generated_at: input.generatedAt }
          : input.status === "generated" || input.status === "published"
            ? { generated_at: new Date().toISOString() }
            : {}),
      })
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id);

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    const result = await getReport(id, access.workspace.organization.id, access.supabase);

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    if (!result.data) {
      return apiError("Report not found.", 404);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "reports",
      entityId: id,
      action: "report_updated",
      details: input,
    });

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid report payload.", 400);
    }

    return apiError("Unexpected report update error.", 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess(["admin", "editor", "approver"]);

  if ("response" in access) {
    return access.response;
  }

  const { id } = await params;
  const existing = await getReport(id, access.workspace.organization.id, access.supabase);

  if (existing.error) {
    return apiError(existing.error.message, 500);
  }

  if (!existing.data) {
    return apiError("Report not found.", 404);
  }

  const deleteResult = await access.supabase
    .from("reports")
    .delete()
    .eq("id", id)
    .eq("organization_id", access.workspace.organization.id);

  if (deleteResult.error) {
    return apiError(deleteResult.error.message, 500);
  }

  await logAuditEvent(access.supabase, {
    organizationId: access.workspace.organization.id,
    actorId: access.workspace.user.id,
    entityType: "reports",
    entityId: id,
    action: "report_deleted",
    details: {
      name: existing.data.name,
    },
  });

  return NextResponse.json({ data: { id, deleted: true } });
}
