import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { forecastUpdateSchema } from "@/lib/schemas/resources";

type ForecastRow = {
  id: string;
  organization_id: string;
  workbook_id: string | null;
  owner_id: string | null;
  name: string;
  status: string;
  horizon_months: number | null;
  created_at: string;
  updated_at: string;
};

async function getForecast(
  id: string,
  organizationId: string,
  supabase: ApiSupabaseClient,
) {
  return supabase
    .from("forecasts")
    .select("id, organization_id, workbook_id, owner_id, name, status, horizon_months, created_at, updated_at")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle<ForecastRow>();
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
  const result = await getForecast(id, access.workspace.organization.id, access.supabase);

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  if (!result.data) {
    return apiError("Forecast not found.", 404);
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
    const input = forecastUpdateSchema.parse(payload);
    const { id } = await params;

    const updateResult = await access.supabase
      .from("forecasts")
      .update({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.workbookId !== undefined ? { workbook_id: input.workbookId } : {}),
        ...(input.ownerId !== undefined ? { owner_id: input.ownerId } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.horizonMonths !== undefined
          ? { horizon_months: input.horizonMonths }
          : {}),
      })
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id);

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    const result = await getForecast(id, access.workspace.organization.id, access.supabase);

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    if (!result.data) {
      return apiError("Forecast not found.", 404);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "forecasts",
      entityId: id,
      action: "forecast_updated",
      details: input,
    });

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid forecast payload.", 400);
    }

    return apiError("Unexpected forecast update error.", 500);
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
  const existing = await getForecast(id, access.workspace.organization.id, access.supabase);

  if (existing.error) {
    return apiError(existing.error.message, 500);
  }

  if (!existing.data) {
    return apiError("Forecast not found.", 404);
  }

  const deleteResult = await access.supabase
    .from("forecasts")
    .delete()
    .eq("id", id)
    .eq("organization_id", access.workspace.organization.id);

  if (deleteResult.error) {
    return apiError(deleteResult.error.message, 500);
  }

  await logAuditEvent(access.supabase, {
    organizationId: access.workspace.organization.id,
    actorId: access.workspace.user.id,
    entityType: "forecasts",
    entityId: id,
    action: "forecast_deleted",
    details: {
      name: existing.data.name,
    },
  });

  return NextResponse.json({ data: { id, deleted: true } });
}
