import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { apiError, parseJsonBody, requireApiAccess } from "@/lib/api/route-helpers";
import { forecastCreateSchema } from "@/lib/schemas/resources";

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

export async function GET() {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const result = await access.supabase
    .from("forecasts")
    .select("id, organization_id, workbook_id, owner_id, name, status, horizon_months, created_at, updated_at")
    .eq("organization_id", access.workspace.organization.id)
    .order("updated_at", { ascending: false })
    .returns<ForecastRow[]>();

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
    const input = forecastCreateSchema.parse(payload);
    const result = await access.supabase
      .from("forecasts")
      .insert({
        organization_id: access.workspace.organization.id,
        workbook_id: input.workbookId ?? null,
        owner_id: input.ownerId ?? access.workspace.user.id,
        name: input.name,
        status: input.status,
        horizon_months: input.horizonMonths ?? null,
      })
      .select("id, organization_id, workbook_id, owner_id, name, status, horizon_months, created_at, updated_at")
      .maybeSingle<ForecastRow>();

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid forecast payload.", 400);
    }

    return apiError("Unexpected forecast creation error.", 500);
  }
}
