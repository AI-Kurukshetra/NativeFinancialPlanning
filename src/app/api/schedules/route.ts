import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { apiError, parseJsonBody, requireApiAccess } from "@/lib/api/route-helpers";
import { scheduleCreateSchema } from "@/lib/schemas/resources";

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

export async function GET() {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const result = await access.supabase
    .from("schedules")
    .select("id, organization_id, report_id, created_by, name, cron_expression, timezone, status, next_run_at, last_run_at, created_at, updated_at")
    .eq("organization_id", access.workspace.organization.id)
    .order("updated_at", { ascending: false })
    .returns<ScheduleRow[]>();

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
    const input = scheduleCreateSchema.parse(payload);
    const result = await access.supabase
      .from("schedules")
      .insert({
        organization_id: access.workspace.organization.id,
        report_id: input.reportId ?? null,
        created_by: access.workspace.user.id,
        name: input.name,
        cron_expression: input.cronExpression,
        timezone: input.timezone,
        status: input.status,
        next_run_at: input.nextRunAt ?? null,
      })
      .select("id, organization_id, report_id, created_by, name, cron_expression, timezone, status, next_run_at, last_run_at, created_at, updated_at")
      .maybeSingle<ScheduleRow>();

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid schedule payload.", 400);
    }

    return apiError("Unexpected schedule creation error.", 500);
  }
}
