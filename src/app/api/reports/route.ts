import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { apiError, parseJsonBody, requireApiAccess } from "@/lib/api/route-helpers";
import { reportCreateSchema } from "@/lib/schemas/resources";

type ReportRow = {
  id: string;
  organization_id: string;
  workbook_id: string | null;
  created_by: string | null;
  name: string;
  status: string;
  definition: Record<string, unknown>;
  generated_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function GET() {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const result = await access.supabase
    .from("reports")
    .select("id, organization_id, workbook_id, created_by, name, status, definition, generated_at, created_at, updated_at")
    .eq("organization_id", access.workspace.organization.id)
    .order("updated_at", { ascending: false })
    .returns<ReportRow[]>();

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  return NextResponse.json({ data: result.data ?? [] });
}

export async function POST(request: NextRequest) {
  const access = await requireApiAccess(["admin", "editor", "approver"]);

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = reportCreateSchema.parse(payload);
    const result = await access.supabase
      .from("reports")
      .insert({
        organization_id: access.workspace.organization.id,
        workbook_id: input.workbookId ?? null,
        created_by: access.workspace.user.id,
        name: input.name,
        status: input.status,
        definition: input.definition,
        generated_at:
          input.generatedAt ??
          (input.status === "generated" || input.status === "published"
            ? new Date().toISOString()
            : null),
      })
      .select("id, organization_id, workbook_id, created_by, name, status, definition, generated_at, created_at, updated_at")
      .maybeSingle<ReportRow>();

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid report payload.", 400);
    }

    return apiError("Unexpected report creation error.", 500);
  }
}
