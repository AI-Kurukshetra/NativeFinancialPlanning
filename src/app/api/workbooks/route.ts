import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import { requireApiAccess, apiError } from "@/lib/api/route-helpers";
import { createWorkbookSchema } from "@/lib/schemas/workbooks";
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

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string;
};

export async function GET() {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const { supabase, workspace } = access;

  const [workbooksResult, ownersResult, collaboratorsResult] = await Promise.all([
    supabase
      .from("workbooks")
      .select("id, organization_id, created_by, name, description, status, created_at, updated_at")
      .eq("organization_id", workspace.organization.id)
      .order("updated_at", { ascending: false })
      .returns<WorkbookRow[]>(),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .returns<ProfileRow[]>(),
    supabase
      .from("organization_memberships")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", workspace.organization.id),
  ]);

  if (workbooksResult.error) {
    return apiError(workbooksResult.error.message, 500);
  }

  if (ownersResult.error) {
    return apiError(ownersResult.error.message, 500);
  }

  if (collaboratorsResult.error) {
    return apiError(collaboratorsResult.error.message, 500);
  }

  const owners = new Map(
    (ownersResult.data ?? []).map((profile) => [
      profile.id,
      profile.full_name?.trim() || profile.email,
    ]),
  );
  const collaborators = collaboratorsResult.count ?? 0;

  return NextResponse.json({
    data: (workbooksResult.data ?? []).map((workbook) => ({
      id: workbook.id,
      name: workbook.name,
      description: workbook.description,
      status: workbook.status,
      owner: owners.get(workbook.created_by) ?? "Unknown",
      updatedAt: workbook.updated_at,
      collaborators,
    })),
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
    const input = createWorkbookSchema.parse(payload);
    const { supabase, workspace } = access;

    const workbookResult = await supabase
      .from("workbooks")
      .insert({
        organization_id: workspace.organization.id,
        created_by: workspace.user.id,
        name: input.name,
        description: input.description,
        status: input.status,
      })
      .select("id, organization_id, created_by, name, description, status, created_at, updated_at")
      .maybeSingle<WorkbookRow>();

    if (workbookResult.error) {
      return apiError(workbookResult.error.message, 500);
    }

    if (!workbookResult.data) {
      return apiError("Workbook creation returned no row.", 500);
    }

    const worksheetResult = await supabase
      .from("worksheets")
      .insert({
        workbook_id: workbookResult.data.id,
        created_by: workspace.user.id,
        name: input.initialWorksheetName,
        position: 0,
      })
      .select("id, workbook_id, name, position, created_at, updated_at")
      .maybeSingle();

    if (worksheetResult.error) {
      return apiError(worksheetResult.error.message, 500);
    }

    await logAuditEvent(supabase, {
      organizationId: workspace.organization.id,
      actorId: workspace.user.id,
      entityType: "workbooks",
      entityId: workbookResult.data.id,
      action: "workbook_created",
      details: {
        worksheetId: worksheetResult.data?.id ?? null,
        status: workbookResult.data.status,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: workbookResult.data.id,
          name: workbookResult.data.name,
          description: workbookResult.data.description,
          status: workbookResult.data.status,
          owner: workspace.user.email ?? "Unknown",
          updatedAt: workbookResult.data.updated_at,
          collaborators: 1,
          worksheets: worksheetResult.data ? [worksheetResult.data] : [],
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid workbook payload.", 400);
    }

    return apiError("Unexpected workbook creation error.", 500);
  }
}
