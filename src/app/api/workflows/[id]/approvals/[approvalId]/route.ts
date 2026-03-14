import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { logAuditEvent } from "@/lib/api/audit";
import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { approvalDecisionSchema } from "@/lib/schemas/resources";

type ApprovalRow = {
  id: string;
  workflow_id: string;
  approver_id: string;
  status: "pending" | "approved" | "rejected";
  decision_note: string | null;
  decision_at: string | null;
};

async function getApproval(
  workflowId: string,
  approvalId: string,
  supabase: ApiSupabaseClient,
) {
  return supabase
    .from("approvals")
    .select("id, workflow_id, approver_id, status, decision_note, decision_at")
    .eq("id", approvalId)
    .eq("workflow_id", workflowId)
    .maybeSingle<ApprovalRow>();
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; approvalId: string }> },
) {
  const access = await requireApiAccess(["admin", "approver"]);

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = approvalDecisionSchema.parse(payload);
    const { id, approvalId } = await params;
    const existing = await getApproval(id, approvalId, access.supabase);

    if (existing.error) {
      return apiError(existing.error.message, 500);
    }

    if (!existing.data) {
      return apiError("Approval not found.", 404);
    }

    if (
      existing.data.approver_id !== access.workspace.user.id &&
      access.workspace.membership.role !== "admin"
    ) {
      return apiError("Only the assigned approver or an admin can decide this approval.", 403);
    }

    const decidedAt = new Date().toISOString();
    const updateApprovalResult = await access.supabase
      .from("approvals")
      .update({
        status: input.status,
        decision_note: input.decisionNote ?? null,
        decision_at: decidedAt,
      })
      .eq("id", approvalId)
      .eq("workflow_id", id);

    if (updateApprovalResult.error) {
      return apiError(updateApprovalResult.error.message, 500);
    }

    const workflowApprovalsResult = await access.supabase
      .from("approvals")
      .select("status")
      .eq("workflow_id", id);

    if (workflowApprovalsResult.error) {
      return apiError(workflowApprovalsResult.error.message, 500);
    }

    const statuses = (workflowApprovalsResult.data ?? []).map((item) => item.status);
    const workflowStatus =
      statuses.includes("rejected")
        ? "rejected"
        : statuses.length > 0 && statuses.every((status) => status === "approved")
          ? "approved"
          : "pending_approval";

    const workflowResult = await access.supabase
      .from("workflows")
      .update({ status: workflowStatus })
      .eq("id", id)
      .eq("organization_id", access.workspace.organization.id);

    if (workflowResult.error) {
      return apiError(workflowResult.error.message, 500);
    }

    const result = await getApproval(id, approvalId, access.supabase);

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    if (!result.data) {
      return apiError("Approval not found.", 404);
    }

    await logAuditEvent(access.supabase, {
      organizationId: access.workspace.organization.id,
      actorId: access.workspace.user.id,
      entityType: "approvals",
      entityId: approvalId,
      action: `approval_${input.status}`,
      details: {
        workflowId: id,
        decisionNote: input.decisionNote ?? null,
      },
    });

    return NextResponse.json({ data: result.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid approval payload.", 400);
    }

    return apiError("Unexpected approval update error.", 500);
  }
}
