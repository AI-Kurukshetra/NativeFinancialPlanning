import Link from "next/link";
import { CheckCircle2, Clock3, FileSpreadsheet, ShieldAlert, TimerReset, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowDetailPageData } from "@/lib/server/app-data";

type WorkflowDetailViewProps = {
  data: WorkflowDetailPageData;
};

function getVariant(status: string) {
  if (status === "approved") {
    return "success" as const;
  }

  if (status === "pending" || status === "pending_approval") {
    return "warning" as const;
  }

  if (status === "rejected") {
    return "destructive" as const;
  }

  return "secondary" as const;
}

export function WorkflowDetailView({ data }: WorkflowDetailViewProps) {
  const pendingApprovals = data.workflow.approvals.filter((approval) => approval.status === "pending");
  const completedApprovals = data.workflow.approvals.filter((approval) => approval.status !== "pending");
  const myApproval = data.workflow.approvals.find(
    (approval) => approval.approver_id === data.currentUserId,
  );
  const workbookSheets = data.workbook?.worksheets.length ?? 0;
  const workbookCells =
    data.workbook?.worksheets.reduce((sum, worksheet) => sum + worksheet.cells.length, 0) ?? 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[34px] border border-black/8 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.97),rgba(236,245,248,0.96),rgba(230,236,244,0.94))] shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
        <div className="grid gap-6 p-6 xl:grid-cols-[1.02fr_0.98fr] xl:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getVariant(data.workflow.status)}>{data.workflow.status}</Badge>
              {data.workflow.currentStep ? <Badge variant="outline">{data.workflow.currentStep}</Badge> : null}
              {data.workflow.workbookName ? <Badge variant="secondary">{data.workflow.workbookName}</Badge> : null}
            </div>

            <div className="space-y-3">
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
                {data.workflow.name}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                {data.workflow.workbookDescription ??
                  "Approval lane for a live planning model, including reviewer state, linked workbook context, and recovery depth."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild leftIcon={<TimerReset className="size-4" />} variant="secondary">
                <Link href="/workflows">Back to workflows</Link>
              </Button>
              {data.workflow.workbookId ? (
                <Button asChild leftIcon={<FileSpreadsheet className="size-4" />} variant="outline">
                  <Link href={`/workbooks/${data.workflow.workbookId}`}>Open linked workbook</Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-black/8 bg-white/82 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pending approvers</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{pendingApprovals.length}</p>
              <p className="mt-2 text-sm text-slate-600">Still waiting to decide in this lane.</p>
            </div>
            <div className="rounded-[24px] border border-black/8 bg-white/82 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Completed</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{completedApprovals.length}</p>
              <p className="mt-2 text-sm text-slate-600">Reviews already closed.</p>
            </div>
            <div className="rounded-[24px] border border-black/8 bg-white/82 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Workbook depth</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                {workbookSheets} sheets · {workbookCells} cells
              </p>
              <p className="mt-2 text-sm text-slate-600">Model context linked to the review lane.</p>
            </div>
            <div className="rounded-[24px] border border-black/8 bg-white/82 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Your lane</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                {myApproval ? myApproval.status : "n/a"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {myApproval ? `Assigned to ${myApproval.approverName}` : "You are not assigned here."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Approval timeline</CardTitle>
            <CardDescription>Reviewer order, current decision state, and notes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.workflow.approvals.length === 0 ? (
              <p className="text-sm text-slate-500">No approvers assigned yet.</p>
            ) : (
              data.workflow.approvals.map((approval, index) => {
                const isAssignedToCurrentUser = approval.approver_id === data.currentUserId;

                return (
                  <div className="relative rounded-[24px] bg-white/75 p-4" key={approval.id}>
                    <div className="absolute left-5 top-5 flex size-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                      {index + 1}
                    </div>
                    <div className="pl-12">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-950">{approval.approverName}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {approval.decision_at
                              ? `Decided ${new Date(approval.decision_at).toLocaleString("en-US")}`
                              : "Awaiting decision"}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {isAssignedToCurrentUser ? <Badge variant="gradient">You</Badge> : null}
                          <Badge variant={getVariant(approval.status)}>{approval.status}</Badge>
                        </div>
                      </div>
                      {approval.decision_note ? (
                        <p className="mt-3 text-sm leading-6 text-slate-600">{approval.decision_note}</p>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-[linear-gradient(180deg,rgba(13,23,36,0.98),rgba(18,45,63,0.96))] text-white">
          <CardHeader>
            <CardTitle className="text-white">Workflow signal</CardTitle>
            <CardDescription className="text-white/70">
              Status summary, assignment pressure, and workbook context in one lane.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                <div className="flex items-center gap-2 text-white/65">
                  <ShieldAlert className="size-4" />
                  <p className="text-xs uppercase tracking-[0.18em]">Current step</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {data.workflow.currentStep ?? "No step set"}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                <div className="flex items-center gap-2 text-white/65">
                  <Users2 className="size-4" />
                  <p className="text-xs uppercase tracking-[0.18em]">Reviewers</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {data.workflow.approvals.length}
                </p>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/8 p-5">
              <div className="mb-4 flex items-center gap-2 text-white/65">
                <Clock3 className="size-4" />
                <p className="text-sm font-medium text-white">Decision pressure</p>
              </div>
              <div className="space-y-3">
                {pendingApprovals.length === 0 ? (
                  <p className="text-sm text-white/72">No pending approvals remain.</p>
                ) : (
                  pendingApprovals.map((approval) => (
                    <div className="rounded-[20px] bg-black/18 px-4 py-3" key={approval.id}>
                      <p className="font-medium text-white">{approval.approverName}</p>
                      <p className="mt-1 text-sm text-white/65">Awaiting decision</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_26%),rgba(255,255,255,0.06)] p-5">
              <div className="mb-4 flex items-center gap-2 text-white/65">
                <CheckCircle2 className="size-4" />
                <p className="text-sm font-medium text-white">Linked workbook</p>
              </div>
              <p className="text-2xl font-semibold text-white">
                {data.workflow.workbookName ?? "No workbook attached"}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/68">
                {data.workflow.workbookStatus
                  ? `Workbook is currently ${data.workflow.workbookStatus.replaceAll("_", " ")}.`
                  : "Attach a workbook to anchor this approval lane in a live model."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
