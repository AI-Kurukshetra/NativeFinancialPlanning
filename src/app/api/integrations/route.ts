import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { apiError, parseJsonBody, requireApiAccess } from "@/lib/api/route-helpers";
import { integrationCreateSchema } from "@/lib/schemas/resources";

type IntegrationRow = {
  id: string;
  organization_id: string;
  created_by: string | null;
  name: string;
  source_type: string;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export async function GET() {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const result = await access.supabase
    .from("data_sources")
    .select("id, organization_id, created_by, name, source_type, config, created_at, updated_at")
    .eq("organization_id", access.workspace.organization.id)
    .order("updated_at", { ascending: false })
    .returns<IntegrationRow[]>();

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
    const input = integrationCreateSchema.parse(payload);
    const result = await access.supabase
      .from("data_sources")
      .insert({
        organization_id: access.workspace.organization.id,
        created_by: access.workspace.user.id,
        name: input.name,
        source_type: input.sourceType,
        config: input.config,
      })
      .select("id, organization_id, created_by, name, source_type, config, created_at, updated_at")
      .maybeSingle<IntegrationRow>();

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid integration payload.", 400);
    }

    return apiError("Unexpected integration creation error.", 500);
  }
}
