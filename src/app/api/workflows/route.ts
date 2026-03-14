import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { workflowCreateSchema } from "@/lib/schemas/resources";

type WorkflowRow = {
  id: string;
  organization_id: string;
  workbook_id: string | null;
  created_by: string | null;
  name: string;
  status: string;
  current_step: string | null;
  created_at: string;
  updated_at: string;
};

type ApprovalRow = {
  id: string;
  workflow_id: string;
  approver_id: string;
  status: string;
  decision_note: string | null;
  decision_at: string | null;
  created_at: string;
  updated_at: string;
};

async function syncApprovals(
  workflowId: string,
  approverIds: string[],
  supabase: ApiSupabaseClient,
) {
  const existingResult = await supabase
    .from("approvals")
    .select("id, approver_id")
    .eq("workflow_id", workflowId);

  if (existingResult.error) {
    return existingResult.error.message;
  }

  const existing = existingResult.data ?? [];
  const existingIds = new Set(existing.map((item) => item.approver_id));
  const requestedIds = new Set(approverIds);

  const toDelete = existing
    .filter((item) => !requestedIds.has(item.approver_id))
    .map((item) => item.id);
  const toInsert = approverIds
    .filter((approverId) => !existingIds.has(approverId))
    .map((approverId) => ({
      workflow_id: workflowId,
      approver_id: approverId,
      status: "pending",
    }));

  if (toDelete.length > 0) {
    const deleteResult = await supabase.from("approvals").delete().in("id", toDelete);

    if (deleteResult.error) {
      return deleteResult.error.message;
    }
  }

  if (toInsert.length > 0) {
    const insertResult = await supabase.from("approvals").insert(toInsert);

    if (insertResult.error) {
      return insertResult.error.message;
    }
  }

  return null;
}

async function listWorkflows(
  organizationId: string,
  supabase: ApiSupabaseClient,
) {
  const [workflowResult, approvalsResult] = await Promise.all([
    supabase
      .from("workflows")
      .select("id, organization_id, workbook_id, created_by, name, status, current_step, created_at, updated_at")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<WorkflowRow[]>(),
    supabase
      .from("approvals")
      .select("id, workflow_id, approver_id, status, decision_note, decision_at, created_at, updated_at")
      .returns<ApprovalRow[]>(),
  ]);

  if (workflowResult.error) {
    return { error: workflowResult.error.message };
  }

  if (approvalsResult.error) {
    return { error: approvalsResult.error.message };
  }

  const approvalsByWorkflow = new Map<string, ApprovalRow[]>();

  for (const approval of approvalsResult.data ?? []) {
    const existing = approvalsByWorkflow.get(approval.workflow_id);

    if (existing) {
      existing.push(approval);
    } else {
      approvalsByWorkflow.set(approval.workflow_id, [approval]);
    }
  }

  return {
    data: (workflowResult.data ?? []).map((workflow) => ({
      ...workflow,
      approvals: approvalsByWorkflow.get(workflow.id) ?? [],
    })),
  };
}

export async function GET() {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const result = await listWorkflows(access.workspace.organization.id, access.supabase);

  if (result.error) {
    return apiError(result.error, 500);
  }

  return NextResponse.json({ data: result.data });
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
    const input = workflowCreateSchema.parse(payload);
    const workflowResult = await access.supabase
      .from("workflows")
      .insert({
        organization_id: access.workspace.organization.id,
        workbook_id: input.workbookId ?? null,
        created_by: access.workspace.user.id,
        name: input.name,
        status: input.status,
        current_step: input.currentStep ?? null,
      })
      .select("id, organization_id, workbook_id, created_by, name, status, current_step, created_at, updated_at")
      .maybeSingle<WorkflowRow>();

    if (workflowResult.error) {
      return apiError(workflowResult.error.message, 500);
    }

    if (!workflowResult.data) {
      return apiError("Workflow creation returned no row.", 500);
    }

    const createdWorkflowId = workflowResult.data.id;
    const syncError = await syncApprovals(
      createdWorkflowId,
      input.approverIds,
      access.supabase,
    );

    if (syncError) {
      return apiError(syncError, 500);
    }

    const result = await listWorkflows(access.workspace.organization.id, access.supabase);

    if (result.error) {
      return apiError(result.error, 500);
    }

    const workflow = (result.data ?? []).find((item) => item.id === createdWorkflowId);

    return NextResponse.json({ data: workflow ?? workflowResult.data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid workflow payload.", 400);
    }

    return apiError("Unexpected workflow creation error.", 500);
  }
}
