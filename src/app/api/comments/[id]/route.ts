import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { commentUpdateSchema } from "@/lib/schemas/resources";

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

async function getComment(
  id: string,
  organizationId: string,
  supabase: ApiSupabaseClient,
) {
  return supabase
    .from("comments")
    .select("id, organization_id, workbook_id, worksheet_id, version_id, row_index, column_index, author_id, body, resolved_at, created_at, updated_at")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle<CommentRow>();
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
  const result = await getComment(id, access.workspace.organization.id, access.supabase);

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  if (!result.data) {
    return apiError("Comment not found.", 404);
  }

  return NextResponse.json({ data: result.data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = commentUpdateSchema.parse(payload);
    const { id } = await params;
    const commentResult = await getComment(id, access.workspace.organization.id, access.supabase);

    if (commentResult.error) {
      return apiError(commentResult.error.message, 500);
    }

    if (!commentResult.data) {
      return apiError("Comment not found.", 404);
    }

    if (
      commentResult.data.author_id !== access.workspace.user.id &&
      access.workspace.membership.role !== "admin"
    ) {
      return apiError("Only the author or an admin can update this comment.", 403);
    }

    const updateResult = await access.supabase
      .from("comments")
      .update({
        ...(input.body !== undefined ? { body: input.body } : {}),
        ...(input.resolved !== undefined
          ? { resolved_at: input.resolved ? new Date().toISOString() : null }
          : {}),
      })
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id);

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    const result = await getComment(id, access.workspace.organization.id, access.supabase);

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    if (!result.data) {
      return apiError("Comment not found.", 404);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "comments",
      entityId: id,
      action: input.resolved !== undefined ? "comment_resolution_updated" : "comment_updated",
      details: input,
    });

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid comment payload.", 400);
    }

    return apiError("Unexpected comment update error.", 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const { id } = await params;
  const existing = await getComment(id, access.workspace.organization.id, access.supabase);

  if (existing.error) {
    return apiError(existing.error.message, 500);
  }

  if (!existing.data) {
    return apiError("Comment not found.", 404);
  }

  if (
    existing.data.author_id !== access.workspace.user.id &&
    access.workspace.membership.role !== "admin"
  ) {
    return apiError("Only the author or an admin can delete this comment.", 403);
  }

  const deleteResult = await access.supabase
    .from("comments")
    .delete()
    .eq("id", id)
    .eq("organization_id", access.workspace.organization.id);

  if (deleteResult.error) {
    return apiError(deleteResult.error.message, 500);
  }

  await logAuditEvent(access.supabase, {
    organizationId: access.workspace.organization.id,
    actorId: access.workspace.user.id,
    entityType: "comments",
    entityId: id,
    action: "comment_deleted",
    details: {
      workbookId: existing.data.workbook_id,
      worksheetId: existing.data.worksheet_id,
    },
  });

  return NextResponse.json({ data: { id, deleted: true } });
}
