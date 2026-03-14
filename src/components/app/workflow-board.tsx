"use client";

import { CheckCircle2, ShieldAlert, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowPageItem } from "@/lib/server/app-data";

type WorkflowBoardProps = {
  currentUserId: string | null;
  items: WorkflowPageItem[];
};

function getStatusVariant(status: string) {
  if (status === "approved") {
    return "success" as const;
  }

  if (status === "pending_approval" || status === "pending") {
    return "warning" as const;
  }

  if (status === "rejected") {
    return "destructive" as const;
  }

  return "secondary" as const;
}

export function WorkflowBoard({ currentUserId, items }: WorkflowBoardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function decideApproval(
    workflowId: string,
    approvalId: string,
    status: "approved" | "rejected",
  ) {
    startTransition(async () => {
      const response = await fetch(
        `/api/workflows/${workflowId}/approvals/${approvalId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? `Failed to mark approval as ${status}.`);
        return;
      }

      toast.success(`Approval ${status}.`);
      router.refresh();
    });
  }

  function deleteWorkflow(id: string) {
    startTransition(async () => {
      const response = await fetch(`/api/workflows/${id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to delete workflow.");
        return;
      }

      toast.success("Workflow deleted.");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow queue</CardTitle>
        <CardDescription>
          Live approval objects with reviewer assignments, decision controls, and
          current workflow state.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No workflows created yet.</p>
        ) : (
          items.map((item) => {
            const myPendingApproval = item.approvals.find(
              (approval) =>
                approval.approver_id === currentUserId && approval.status === "pending",
            );

            return (
              <div className="rounded-[28px] border border-white/55 bg-white/75 p-5" key={item.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-950">{item.name}</p>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status.replaceAll("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {item.currentStep
                        ? `Current step: ${item.currentStep}`
                        : "No current review step set"}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Updated {new Date(item.updatedAt).toLocaleString("en-US")}
                    </p>
                  </div>
                  <Button
                    leftIcon={<Trash2 className="size-4" />}
                    loading={isPending}
                    onClick={() => deleteWorkflow(item.id)}
                    size="sm"
                    variant="ghost"
                  >
                    Delete
                  </Button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {item.approvals.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      No approvers assigned yet.
                    </div>
                  ) : (
                    item.approvals.map((approval) => {
                      const isAssignedToCurrentUser =
                        approval.approver_id === currentUserId;
                      const isPendingDecision = approval.status === "pending";

                      return (
                        <div
                          className="rounded-2xl bg-slate-50/90 px-4 py-3"
                          key={approval.id}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-slate-950">
                                {approval.approverName}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {approval.decision_at
                                  ? `Decided ${new Date(approval.decision_at).toLocaleString("en-US")}`
                                  : "Awaiting decision"}
                              </p>
                            </div>
                            <Badge
                              variant={
                                isAssignedToCurrentUser && isPendingDecision
                                  ? "gradient"
                                  : getStatusVariant(approval.status)
                              }
                            >
                              {approval.status}
                            </Badge>
                          </div>

                          {approval.decision_note ? (
                            <p className="mt-3 text-sm text-slate-600">
                              {approval.decision_note}
                            </p>
                          ) : null}

                          {isAssignedToCurrentUser && isPendingDecision ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              <Button
                                leftIcon={<CheckCircle2 className="size-4" />}
                                loading={isPending}
                                onClick={() =>
                                  decideApproval(item.id, approval.id, "approved")
                                }
                                size="sm"
                                variant="secondary"
                              >
                                Approve
                              </Button>
                              <Button
                                leftIcon={<XCircle className="size-4" />}
                                loading={isPending}
                                onClick={() =>
                                  decideApproval(item.id, approval.id, "rejected")
                                }
                                size="sm"
                                variant="outline"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      );
                    })
                  )}
                </div>

                {myPendingApproval ? (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <ShieldAlert className="size-4 shrink-0" />
                    This workflow is currently waiting on your decision.
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
