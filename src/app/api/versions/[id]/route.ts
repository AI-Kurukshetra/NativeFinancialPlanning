import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { versionUpdateSchema } from "@/lib/schemas/resources";

type VersionRow = {
  id: string;
  organization_id: string;
  workbook_id: string;
  created_by: string | null;
  label: string;
  snapshot: Record<string, unknown>;
  created_at: string;
};

async function getVersion(
  id: string,
  organizationId: string,
  supabase: ApiSupabaseClient,
) {
  return supabase
    .from("versions")
    .select("id, organization_id, workbook_id, created_by, label, snapshot, created_at")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle<VersionRow>();
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
  const result = await getVersion(id, access.workspace.organization.id, access.supabase);

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  if (!result.data) {
    return apiError("Version not found.", 404);
  }

  return NextResponse.json({ data: result.data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess(["admin", "editor"]);

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = versionUpdateSchema.parse(payload);
    const { id } = await params;
    const updateResult = await access.supabase
      .from("versions")
      .update({ label: input.label })
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id);

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    const result = await getVersion(id, access.workspace.organization.id, access.supabase);

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    if (!result.data) {
      return apiError("Version not found.", 404);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "versions",
      entityId: id,
      action: "version_renamed",
      details: {
        label: input.label,
      },
    });

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid version payload.", 400);
    }

    return apiError("Unexpected version update error.", 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess(["admin", "editor"]);

  if ("response" in access) {
    return access.response;
  }

  const { id } = await params;
  const existing = await getVersion(id, access.workspace.organization.id, access.supabase);

  if (existing.error) {
    return apiError(existing.error.message, 500);
  }

  if (!existing.data) {
    return apiError("Version not found.", 404);
  }

  const deleteResult = await access.supabase
    .from("versions")
    .delete()
    .eq("id", id)
    .eq("organization_id", access.workspace.organization.id);

  if (deleteResult.error) {
    return apiError(deleteResult.error.message, 500);
  }

  await logAuditEvent(access.supabase, {
    organizationId: access.workspace.organization.id,
    actorId: access.workspace.user.id,
    entityType: "versions",
    entityId: id,
    action: "version_deleted",
    details: {
      workbookId: existing.data.workbook_id,
      label: existing.data.label,
    },
  });

  return NextResponse.json({ data: { id, deleted: true } });
}
