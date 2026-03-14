import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { workflowUpdateSchema } from "@/lib/schemas/resources";

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

async function getWorkflow(
  id: string,
  organizationId: string,
  supabase: ApiSupabaseClient,
) {
  const [workflowResult, approvalsResult] = await Promise.all([
    supabase
      .from("workflows")
      .select("id, organization_id, workbook_id, created_by, name, status, current_step, created_at, updated_at")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .maybeSingle<WorkflowRow>(),
    supabase
      .from("approvals")
      .select("id, workflow_id, approver_id, status, decision_note, decision_at, created_at, updated_at")
      .eq("workflow_id", id)
      .returns<ApprovalRow[]>(),
  ]);

  if (workflowResult.error) {
    return { error: workflowResult.error.message };
  }

  if (!workflowResult.data) {
    return { error: "Workflow not found.", status: 404 };
  }

  if (approvalsResult.error) {
    return { error: approvalsResult.error.message };
  }

  return {
    data: {
      ...workflowResult.data,
      approvals: approvalsResult.data ?? [],
    },
  };
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
  const result = await getWorkflow(id, access.workspace.organization.id, access.supabase);

  if (result.error) {
    return apiError(result.error, result.status ?? 500);
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
    const input = workflowUpdateSchema.parse(payload);
    const { id } = await params;
    const updateResult = await access.supabase
      .from("workflows")
      .update({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.workbookId !== undefined ? { workbook_id: input.workbookId } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.currentStep !== undefined ? { current_step: input.currentStep } : {}),
      })
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id);

    if (updateResult.error) {
      return apiError(updateResult.error.message, 500);
    }

    if (input.approverIds !== undefined) {
      const syncError = await syncApprovals(id, input.approverIds, access.supabase);

      if (syncError) {
        return apiError(syncError, 500);
      }
    }

    const result = await getWorkflow(id, access.workspace.organization.id, access.supabase);

    if (result.error) {
      return apiError(result.error, result.status ?? 500);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "workflows",
      entityId: id,
      action: "workflow_updated",
      details: input,
    });

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid workflow payload.", 400);
    }

    return apiError("Unexpected workflow update error.", 500);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess(["admin", "editor", "approver"]);

  if ("response" in access) {
    return access.response;
  }

  const { id } = await params;
  const existing = await getWorkflow(id, access.workspace.organization.id, access.supabase);

  if (existing.error) {
    return apiError(existing.error, existing.status ?? 500);
  }

  const existingWorkflow = existing.data;

  if (!existingWorkflow) {
    return apiError("Workflow not found.", 404);
  }

  const deleteResult = await access.supabase
    .from("workflows")
    .delete()
    .eq("id", id)
    .eq("organization_id", access.workspace.organization.id);

  if (deleteResult.error) {
    return apiError(deleteResult.error.message, 500);
  }

  await logAuditEvent(access.supabase, {
    organizationId: access.workspace.organization.id,
    actorId: access.workspace.user.id,
    entityType: "workflows",
    entityId: id,
    action: "workflow_deleted",
    details: {
      name: existingWorkflow.name,
      approvalCount: existingWorkflow.approvals.length,
    },
  });

  return NextResponse.json({ data: { id, deleted: true } });
}
