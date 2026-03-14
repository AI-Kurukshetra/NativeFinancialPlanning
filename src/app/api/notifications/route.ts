import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { apiError, parseJsonBody, requireApiAccess } from "@/lib/api/route-helpers";
import { notificationCreateSchema } from "@/lib/schemas/resources";

type NotificationRow = {
  id: string;
  organization_id: string;
  user_id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function GET(request: NextRequest) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  let query = access.supabase
    .from("notifications")
    .select("id, organization_id, user_id, kind, title, body, link, metadata, read_at, created_at, updated_at")
    .eq("organization_id", access.workspace.organization.id)
    .eq("user_id", access.workspace.user.id)
    .order("created_at", { ascending: false });

  if (request.nextUrl.searchParams.get("unread") === "true") {
    query = query.is("read_at", null);
  }

  const result = await query.returns<NotificationRow[]>();

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
    const input = notificationCreateSchema.parse(payload);
    const result = await access.supabase
      .from("notifications")
      .insert({
        organization_id: access.workspace.organization.id,
        user_id: input.userId,
        kind: input.kind,
        title: input.title,
        body: input.body,
        link: input.link ?? null,
        metadata: input.metadata,
      })
      .select("id, organization_id, user_id, kind, title, body, link, metadata, read_at, created_at, updated_at")
      .maybeSingle<NotificationRow>();

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid notification payload.", 400);
    }

    return apiError("Unexpected notification creation error.", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null || payload.readAll !== true) {
    return apiError("Only bulk mark-all-read is supported on this route.", 400);
  }

  const result = await access.supabase
    .from("notifications")
    .update({
      read_at: new Date().toISOString(),
    })
    .eq("organization_id", access.workspace.organization.id)
    .eq("user_id", access.workspace.user.id)
    .is("read_at", null);

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  return NextResponse.json({ data: { ok: true } });
}
