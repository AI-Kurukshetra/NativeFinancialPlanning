import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { templateUpdateSchema } from "@/lib/schemas/resources";

type TemplateRow = {
  id: string;
  organization_id: string | null;
  created_by: string | null;
  name: string;
  category: string;
  description: string;
  workbook_template: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

async function getTemplate(
  id: string,
  organizationId: string,
  supabase: ApiSupabaseClient,
) {
  return supabase
    .from("templates")
    .select("id, organization_id, created_by, name, category, description, workbook_template, created_at, updated_at")
    .eq("id", id)
    .or(`organization_id.is.null,organization_id.eq.${organizationId}`)
    .maybeSingle<TemplateRow>();
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
  const result = await getTemplate(id, access.workspace.organization.id, access.supabase);

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  if (!result.data) {
    return apiError("Template not found.", 404);
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
    const input = templateUpdateSchema.parse(payload);
    const { id } = await params;
    const updateResult = await access.supabase
      .from("templates")
      .update({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.workbookTemplate !== undefined
          ? { workbook_template: input.workbookTemplate }
          : {}),
      })
      .eq("id", id);

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    const result = await getTemplate(id, access.workspace.organization.id, access.supabase);

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    if (!result.data) {
      return apiError("Template not found.", 404);
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid template payload.", 400);
    }

    return apiError("Unexpected template update error.", 500);
  }
}
