import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { notificationUpdateSchema } from "@/lib/schemas/resources";

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

async function getNotification(
  id: string,
  organizationId: string,
  userId: string,
  supabase: ApiSupabaseClient,
) {
  return supabase
    .from("notifications")
    .select("id, organization_id, user_id, kind, title, body, link, metadata, read_at, created_at, updated_at")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .maybeSingle<NotificationRow>();
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
  const result = await getNotification(
    id,
    access.workspace.organization.id,
    access.workspace.user.id,
    access.supabase,
  );

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  if (!result.data) {
    return apiError("Notification not found.", 404);
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
    const input = notificationUpdateSchema.parse(payload);
    const { id } = await params;
    const updateResult = await access.supabase
      .from("notifications")
      .update({
        read_at: input.read ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id)
      .eq("user_id", access.workspace.user.id);

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    const result = await getNotification(
      id,
      access.workspace.organization.id,
      access.workspace.user.id,
      access.supabase,
    );

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    if (!result.data) {
      return apiError("Notification not found.", 404);
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid notification payload.", 400);
    }

    return apiError("Unexpected notification update error.", 500);
  }
}
