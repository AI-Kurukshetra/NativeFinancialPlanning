import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { scheduleUpdateSchema } from "@/lib/schemas/resources";

type ScheduleRow = {
  id: string;
  organization_id: string;
  report_id: string | null;
  created_by: string | null;
  name: string;
  cron_expression: string;
  timezone: string;
  status: string;
  next_run_at: string | null;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
};

async function getSchedule(
  id: string,
  organizationId: string,
  supabase: ApiSupabaseClient,
) {
  return supabase
    .from("schedules")
    .select("id, organization_id, report_id, created_by, name, cron_expression, timezone, status, next_run_at, last_run_at, created_at, updated_at")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle<ScheduleRow>();
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
  const result = await getSchedule(id, access.workspace.organization.id, access.supabase);

  if (result.error) {
    return apiError(result.error.message, 500);
  }

  if (!result.data) {
    return apiError("Schedule not found.", 404);
  }

  return NextResponse.json({ data: result.data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess(["admin", "editor", "approver"]);

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = scheduleUpdateSchema.parse(payload);
    const { id } = await params;
    const updateResult = await access.supabase
      .from("schedules")
      .update({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.reportId !== undefined ? { report_id: input.reportId } : {}),
        ...(input.cronExpression !== undefined
          ? { cron_expression: input.cronExpression }
          : {}),
        ...(input.timezone !== undefined ? { timezone: input.timezone } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.nextRunAt !== undefined ? { next_run_at: input.nextRunAt } : {}),
        ...(input.lastRunAt !== undefined ? { last_run_at: input.lastRunAt } : {}),
      })
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id);

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    const result = await getSchedule(id, access.workspace.organization.id, access.supabase);

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    if (!result.data) {
      return apiError("Schedule not found.", 404);
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid schedule payload.", 400);
    }

    return apiError("Unexpected schedule update error.", 500);
  }
}
