import type { SupabaseClient } from "@supabase/supabase-js";
import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import { requireApiAccess, apiError } from "@/lib/api/route-helpers";
import { updateWorkbookSchema } from "@/lib/schemas/workbooks";
import type { WorkbookStatus } from "@/lib/types";

type WorkbookRow = {
  id: string;
  organization_id: string;
  created_by: string;
  name: string;
  description: string;
  status: WorkbookStatus;
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

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string;
};

async function getWorkbookWithChildren(
  workbookId: string,
  organizationId: string,
  profileEmail: string | null,
  supabase: SupabaseClient,
) {
  const workbookResult = await supabase
    .from("workbooks")
    .select("id, organization_id, created_by, name, description, status, created_at, updated_at")
    .eq("id", workbookId)
    .eq("organization_id", organizationId)
    .maybeSingle<WorkbookRow>();

  if (workbookResult.error) {
    return { response: apiError(workbookResult.error.message, 500) };
  }

  if (!workbookResult.data) {
    return { response: apiError("Workbook not found.", 404) };
  }

  const [worksheetsResult, ownerResult, collaboratorsResult] = await Promise.all([
      supabase
        .from("worksheets")
        .select("id, workbook_id, name, position, created_at, updated_at")
        .eq("workbook_id", workbookId)
        .order("position", { ascending: true })
        .returns<WorksheetRow[]>(),
      supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", workbookResult.data.created_by)
        .maybeSingle<ProfileRow>(),
      supabase
        .from("organization_memberships")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", organizationId),
    ]);

  if (worksheetsResult.error) {
    return { response: apiError(worksheetsResult.error.message, 500) };
  }

  if (ownerResult.error) {
    return { response: apiError(ownerResult.error.message, 500) };
  }

  if (collaboratorsResult.error) {
    return { response: apiError(collaboratorsResult.error.message, 500) };
  }

  return {
    data: {
      id: workbookResult.data.id,
      name: workbookResult.data.name,
      description: workbookResult.data.description,
      status: workbookResult.data.status,
      owner:
        ownerResult.data?.full_name?.trim() ||
        ownerResult.data?.email ||
        profileEmail ||
        "Unknown",
      updatedAt: workbookResult.data.updated_at,
      collaborators: collaboratorsResult.count ?? 0,
      worksheets: worksheetsResult.data ?? [],
    },
  };
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
  const workbook = await getWorkbookWithChildren(
    id,
    access.workspace.organization.id,
    access.workspace.user.email,
    access.supabase,
  );

  if ("response" in workbook) {
    return workbook.response;
  }

  return NextResponse.json({ data: workbook.data });
}

export async function PATCH(
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
    const input = updateWorkbookSchema.parse(payload);
    const { id } = await params;

    const updateResult = await access.supabase
      .from("workbooks")
      .update(input)
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id)
      .select("id")
      .maybeSingle();

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    if (!updateResult.data) {
      return apiError("Workbook not found.", 404);
    }

    const workbook = await getWorkbookWithChildren(
      id,
      access.workspace.organization.id,
      access.workspace.user.email,
      access.supabase,
    );

    if ("response" in workbook) {
      return workbook.response;
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "workbooks",
      entityId: id,
      action: "workbook_updated",
      details: input,
    });

    return NextResponse.json({ data: workbook.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid workbook payload.", 400);
    }

    return apiError("Unexpected workbook update error.", 500);
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
  const workbook = await getWorkbookWithChildren(
    id,
    access.workspace.organization.id,
    access.workspace.user.email,
    access.supabase,
  );

  if ("response" in workbook) {
    return workbook.response;
  }

  const deleteResult = await access.supabase
    .from("workbooks")
    .delete()
    .eq("id", id)
    .eq("organization_id", access.workspace.organization.id);

  if (deleteResult.error) {
    return apiError(deleteResult.error.message, 500);
  }

  await logAuditEvent(access.supabase, {
    organizationId: access.workspace.organization.id,
    actorId: access.workspace.user.id,
    entityType: "workbooks",
    entityId: id,
    action: "workbook_deleted",
    details: {
      name: workbook.data.name,
      worksheetCount: workbook.data.worksheets.length,
    },
  });

  return NextResponse.json({ data: { id, deleted: true } });
}
