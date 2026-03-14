import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { apiError, parseJsonBody, requireApiAccess } from "@/lib/api/route-helpers";
import { commentCreateSchema } from "@/lib/schemas/resources";

type CommentRow = {
  id: string;
  organization_id: string;
  workbook_id: string | null;
  worksheet_id: string | null;
  version_id: string | null;
  row_index: number | null;
  column_index: number | null;
  author_id: string;
  body: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function GET(request: NextRequest) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  let query = access.supabase
    .from("comments")
    .select("id, organization_id, workbook_id, worksheet_id, version_id, row_index, column_index, author_id, body, resolved_at, created_at, updated_at")
    .eq("organization_id", access.workspace.organization.id)
    .order("updated_at", { ascending: false });

  const workbookId = request.nextUrl.searchParams.get("workbookId");
  const worksheetId = request.nextUrl.searchParams.get("worksheetId");
  const versionId = request.nextUrl.searchParams.get("versionId");
  const unresolved = request.nextUrl.searchParams.get("unresolved");

  if (workbookId) {
    query = query.eq("workbook_id", workbookId);
  }

  if (worksheetId) {
    query = query.eq("worksheet_id", worksheetId);
  }

  if (versionId) {
    query = query.eq("version_id", versionId);
  }

  if (unresolved === "true") {
    query = query.is("resolved_at", null);
  }

  const result = await query.returns<CommentRow[]>();

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  return NextResponse.json({ data: result.data ?? [] });
}

export async function POST(request: NextRequest) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = commentCreateSchema.parse(payload);
    const result = await access.supabase
      .from("comments")
      .insert({
        organization_id: access.workspace.organization.id,
        workbook_id: input.workbookId ?? null,
        worksheet_id: input.worksheetId ?? null,
        version_id: input.versionId ?? null,
        row_index: input.rowIndex ?? null,
        column_index: input.columnIndex ?? null,
        author_id: access.workspace.user.id,
        body: input.body,
      })
      .select("id, organization_id, workbook_id, worksheet_id, version_id, row_index, column_index, author_id, body, resolved_at, created_at, updated_at")
      .maybeSingle<CommentRow>();

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid comment payload.", 400);
    }

    return apiError("Unexpected comment creation error.", 500);
  }
}
