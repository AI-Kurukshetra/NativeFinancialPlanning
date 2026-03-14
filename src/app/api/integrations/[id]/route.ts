import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { integrationUpdateSchema } from "@/lib/schemas/resources";

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

async function getIntegration(
  id: string,
  organizationId: string,
  supabase: ApiSupabaseClient,
) {
  return supabase
    .from("data_sources")
    .select("id, organization_id, created_by, name, source_type, config, created_at, updated_at")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle<IntegrationRow>();
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
  const result = await getIntegration(id, access.workspace.organization.id, access.supabase);

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  if (!result.data) {
    return apiError("Integration not found.", 404);
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
    const input = integrationUpdateSchema.parse(payload);
    const { id } = await params;
    const updateResult = await access.supabase
      .from("data_sources")
      .update({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.sourceType !== undefined ? { source_type: input.sourceType } : {}),
        ...(input.config !== undefined ? { config: input.config } : {}),
      })
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id);

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    const result = await getIntegration(id, access.workspace.organization.id, access.supabase);

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    if (!result.data) {
      return apiError("Integration not found.", 404);
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid integration payload.", 400);
    }

    return apiError("Unexpected integration update error.", 500);
  }
}
