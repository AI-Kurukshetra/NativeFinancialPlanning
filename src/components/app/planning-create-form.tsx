"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApproverChoice } from "@/lib/server/app-data";

type PlanningCreateFormProps = {
  endpoint: "/api/budgets" | "/api/forecasts" | "/api/reports" | "/api/workflows";
  title: string;
  submitLabel: string;
  workbookOptions: Array<{ id: string; name: string }>;
  extraFields?: "budget" | "forecast" | "report" | "workflow";
  peopleOptions?: ApproverChoice[];
};

export function PlanningCreateForm({
  endpoint,
  title,
  submitLabel,
  workbookOptions,
  extraFields = "budget",
  peopleOptions = [],
}: PlanningCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [workbookId, setWorkbookId] = useState("");
  const [status, setStatus] = useState("draft");
  const [secondaryValue, setSecondaryValue] = useState("");
  const [selectedApproverIds, setSelectedApproverIds] = useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const payload: Record<string, unknown> = {
        name,
        workbookId: workbookId || undefined,
        status,
      };

      if (extraFields === "budget") {
        payload.startsOn = secondaryValue || undefined;
      }

      if (extraFields === "forecast") {
        payload.horizonMonths = secondaryValue ? Number(secondaryValue) : undefined;
      }

      if (extraFields === "report") {
        payload.definition = {
          layout: "executive_summary",
        };
      }

      if (extraFields === "workflow") {
        payload.currentStep = secondaryValue || undefined;
        payload.approverIds = selectedApproverIds;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? `Failed to create ${title.toLowerCase()}.`);
        return;
      }

      toast.success(`${title} created.`);
      setName("");
      setWorkbookId("");
      setSecondaryValue("");
      setSelectedApproverIds([]);
      router.refresh();
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${title}-name`}>
          {title} name
        </label>
        <Input
          id={`${title}-name`}
          onChange={(event) => setName(event.target.value)}
          placeholder={`Create ${title.toLowerCase()} entry`}
          value={name}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${title}-workbook`}>
            Workbook
          </label>
          <select
            className="flex h-11 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id={`${title}-workbook`}
            onChange={(event) => setWorkbookId(event.target.value)}
            value={workbookId}
          >
            <option value="">No linked workbook</option>
            {workbookOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${title}-status`}>
            Status
          </label>
          <select
            className="flex h-11 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id={`${title}-status`}
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            <option value="draft">Draft</option>
            <option value={extraFields === "report" ? "generated" : "active"}>
              {extraFields === "report" ? "Generated" : "Active"}
            </option>
            <option value={extraFields === "workflow" ? "pending_approval" : "archived"}>
              {extraFields === "workflow" ? "Pending approval" : "Archived"}
            </option>
          </select>
        </div>
      </div>

      {extraFields === "budget" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${title}-date`}>
            Start date
          </label>
          <Input
            id={`${title}-date`}
            onChange={(event) => setSecondaryValue(event.target.value)}
            type="date"
            value={secondaryValue}
          />
        </div>
      ) : null}

      {extraFields === "forecast" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${title}-months`}>
            Horizon months
          </label>
          <Input
            id={`${title}-months`}
            min={1}
            onChange={(event) => setSecondaryValue(event.target.value)}
            placeholder="12"
            type="number"
            value={secondaryValue}
          />
        </div>
      ) : null}

      {extraFields === "workflow" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800" htmlFor={`${title}-step`}>
              Current step
            </label>
            <Input
              id={`${title}-step`}
              onChange={(event) => setSecondaryValue(event.target.value)}
              placeholder="Finance review"
              value={secondaryValue}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-slate-800">Approvers</label>
              <span className="text-xs text-slate-500">
                {selectedApproverIds.length} selected
              </span>
            </div>
            <div className="grid gap-2 rounded-2xl border border-white/60 bg-white/55 p-3 sm:grid-cols-2">
              {peopleOptions.length === 0 ? (
                <p className="text-sm text-slate-500">No workspace members available yet.</p>
              ) : (
                peopleOptions.map((person) => {
                  const checked = selectedApproverIds.includes(person.id);

                  return (
                    <label
                      className="flex items-start gap-3 rounded-2xl bg-white/70 px-3 py-2 text-sm text-slate-700"
                      key={person.id}
                    >
                      <input
                        checked={checked}
                        className="mt-1"
                        onChange={(event) => {
                          setSelectedApproverIds((current) =>
                            event.target.checked
                              ? [...current, person.id]
                              : current.filter((value) => value !== person.id),
                          );
                        }}
                        type="checkbox"
                      />
                      <span>
                        <span className="block font-medium text-slate-950">{person.name}</span>
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {person.role}
                        </span>
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : null}

      <Button className="w-full sm:w-auto" disabled={isPending || name.trim().length < 2} type="submit">
        {isPending ? `${submitLabel}...` : submitLabel}
      </Button>
    </form>
  );
}
