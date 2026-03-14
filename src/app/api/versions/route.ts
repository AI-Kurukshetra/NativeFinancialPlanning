import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { getWorkbookSnapshot } from "@/lib/api/workbook-snapshots";
import { logAuditEvent } from "@/lib/api/audit";
import { apiError, parseJsonBody, requireApiAccess } from "@/lib/api/route-helpers";
import { versionCreateSchema } from "@/lib/schemas/resources";

type VersionRow = {
  id: string;
  organization_id: string;
  workbook_id: string;
  created_by: string | null;
  label: string;
  snapshot: Record<string, unknown>;
  created_at: string;
};

export async function GET(request: NextRequest) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  let query = access.supabase
    .from("versions")
    .select("id, organization_id, workbook_id, created_by, label, snapshot, created_at")
    .eq("organization_id", access.workspace.organization.id)
    .order("created_at", { ascending: false });

  const workbookId = request.nextUrl.searchParams.get("workbookId");

  if (workbookId) {
    query = query.eq("workbook_id", workbookId);
  }

  const result = await query.returns<VersionRow[]>();

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  return NextResponse.json({ data: result.data ?? [] });
}

export async function POST(request: NextRequest) {
  const access = await requireApiAccess(["admin", "editor"]);

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = versionCreateSchema.parse(payload);
    let resolvedSnapshot: Record<string, unknown> = input.snapshot ?? {};

    if (!input.snapshot) {
      const snapshotResult = await getWorkbookSnapshot(
        access.supabase,
        access.workspace.organization.id,
        input.workbookId,
      );

      if (snapshotResult.error) {
        return apiError(snapshotResult.error, 500);
      }

      resolvedSnapshot = snapshotResult.data as unknown as Record<string, unknown>;
    }

    const result = await access.supabase
      .from("versions")
      .insert({
        organization_id: access.workspace.organization.id,
        workbook_id: input.workbookId,
        created_by: access.workspace.user.id,
        label: input.label,
        snapshot: resolvedSnapshot,
      })
      .select("id, organization_id, workbook_id, created_by, label, snapshot, created_at")
      .maybeSingle<VersionRow>();

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "versions",
      entityId: result.data?.id ?? null,
      action: "version_created",
      details: {
        workbookId: input.workbookId,
        label: input.label,
      },
    });

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid version payload.", 400);
    }

    return apiError("Unexpected version creation error.", 500);
  }
}
