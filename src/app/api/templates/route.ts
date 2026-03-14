import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { apiError, parseJsonBody, requireApiAccess } from "@/lib/api/route-helpers";
import { templateCreateSchema } from "@/lib/schemas/resources";

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

export async function GET() {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const result = await access.supabase
    .from("templates")
    .select("id, organization_id, created_by, name, category, description, workbook_template, created_at, updated_at")
    .or(`organization_id.is.null,organization_id.eq.${access.workspace.organization.id}`)
    .order("updated_at", { ascending: false })
    .returns<TemplateRow[]>();

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
    const input = templateCreateSchema.parse(payload);
    const result = await access.supabase
      .from("templates")
      .insert({
        organization_id: input.isGlobal ? null : access.workspace.organization.id,
        created_by: access.workspace.user.id,
        name: input.name,
        category: input.category,
        description: input.description,
        workbook_template: input.workbookTemplate,
      })
      .select("id, organization_id, created_by, name, category, description, workbook_template, created_at, updated_at")
      .maybeSingle<TemplateRow>();

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid template payload.", 400);
    }

    return apiError("Unexpected template creation error.", 500);
  }
}
