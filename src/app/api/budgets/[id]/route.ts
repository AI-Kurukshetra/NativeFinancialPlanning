import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { budgetUpdateSchema } from "@/lib/schemas/resources";

type BudgetRow = {
  id: string;
  organization_id: string;
  workbook_id: string | null;
  owner_id: string | null;
  name: string;
  status: string;
  starts_on: string | null;
  ends_on: string | null;
  created_at: string;
  updated_at: string;
};

async function getBudget(
  id: string,
  organizationId: string,
  supabase: ApiSupabaseClient,
) {
  return supabase
    .from("budgets")
    .select("id, organization_id, workbook_id, owner_id, name, status, starts_on, ends_on, created_at, updated_at")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle<BudgetRow>();
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
  const result = await getBudget(id, access.workspace.organization.id, access.supabase);

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  if (!result.data) {
    return apiError("Budget not found.", 404);
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
    const input = budgetUpdateSchema.parse(payload);

    if (input.startsOn && input.endsOn && input.startsOn > input.endsOn) {
      return apiError("Budget start date must be on or before the end date.", 400);
    }

    const { id } = await params;
    const updateResult = await access.supabase
      .from("budgets")
      .update({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.workbookId !== undefined ? { workbook_id: input.workbookId } : {}),
        ...(input.ownerId !== undefined ? { owner_id: input.ownerId } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.startsOn !== undefined ? { starts_on: input.startsOn } : {}),
        ...(input.endsOn !== undefined ? { ends_on: input.endsOn } : {}),
      })
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id);

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    const result = await getBudget(id, access.workspace.organization.id, access.supabase);

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    if (!result.data) {
      return apiError("Budget not found.", 404);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "budgets",
      entityId: id,
      action: "budget_updated",
      details: input,
    });

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid budget payload.", 400);
    }

    return apiError("Unexpected budget update error.", 500);
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
  const existing = await getBudget(id, access.workspace.organization.id, access.supabase);

  if (existing.error) {
    return apiError(existing.error.message, 500);
  }

  if (!existing.data) {
    return apiError("Budget not found.", 404);
  }

  const deleteResult = await access.supabase
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("organization_id", access.workspace.organization.id);

  if (deleteResult.error) {
    return apiError(deleteResult.error.message, 500);
  }

  await logAuditEvent(access.supabase, {
    organizationId: access.workspace.organization.id,
    actorId: access.workspace.user.id,
    entityType: "budgets",
    entityId: id,
    action: "budget_deleted",
    details: {
      name: existing.data.name,
    },
  });

  return NextResponse.json({ data: { id, deleted: true } });
}
