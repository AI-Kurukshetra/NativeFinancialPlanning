"use client";

import Link from "next/link";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BudgetPageItem, ForecastPageItem } from "@/lib/server/app-data";

type PlanningRegisterProps =
  | {
      kind: "budget";
      items: BudgetPageItem[];
      title: string;
      description: string;
    }
  | {
      kind: "forecast";
      items: ForecastPageItem[];
      title: string;
      description: string;
    };

type DraftState = {
  name: string;
  status: string;
  secondaryValue: string;
};

function isBudgetItem(item: BudgetPageItem | ForecastPageItem): item is BudgetPageItem {
  return "startsOn" in item;
}

function getBadgeVariant(status: string) {
  if (status === "active" || status === "published") {
    return "success" as const;
  }

  if (status === "locked" || status === "pending_approval") {
    return "warning" as const;
  }

  if (status === "archived") {
    return "outline" as const;
  }

  return "secondary" as const;
}

export function PlanningRegister(props: PlanningRegisterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftState | null>(null);

  const items = props.items;

  function beginEdit(item: BudgetPageItem | ForecastPageItem) {
    setEditingId(item.id);
    setDraft({
      name: item.name,
      status: item.status,
      secondaryValue:
        props.kind === "budget" && isBudgetItem(item)
          ? item.startsOn ?? ""
          : !isBudgetItem(item) && item.horizonMonths
            ? String(item.horizonMonths)
            : "",
    });
  }

  function saveItem(id: string) {
    if (!draft) {
      return;
    }

    startTransition(async () => {
      const payload =
        props.kind === "budget"
          ? {
              name: draft.name,
              status: draft.status,
              startsOn: draft.secondaryValue || null,
            }
          : {
              name: draft.name,
              status: draft.status,
              horizonMonths: draft.secondaryValue ? Number(draft.secondaryValue) : null,
            };

      const endpoint = props.kind === "budget" ? `/api/budgets/${id}` : `/api/forecasts/${id}`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(
          result.error ??
            `Failed to update ${props.kind === "budget" ? "budget" : "forecast"}.`,
        );
        return;
      }

      toast.success(`${props.kind === "budget" ? "Budget" : "Forecast"} updated.`);
      setEditingId(null);
      setDraft(null);
      router.refresh();
    });
  }

  function deleteItem(id: string) {
    startTransition(async () => {
      const endpoint = props.kind === "budget" ? `/api/budgets/${id}` : `/api/forecasts/${id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(
          result.error ??
            `Failed to delete ${props.kind === "budget" ? "budget" : "forecast"}.`,
        );
        return;
      }

      toast.success(`${props.kind === "budget" ? "Budget" : "Forecast"} deleted.`);
      setEditingId(null);
      setDraft(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{props.title}</h2>
        <p className="mt-1 text-sm text-slate-600">{props.description}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No {props.kind === "budget" ? "budgets" : "forecasts"} created yet.
        </p>
      ) : (
        items.map((item) => {
          const isEditing = editingId === item.id;

          return (
            <div className="rounded-[28px] bg-white/75 p-5" key={item.id}>
              {isEditing && draft ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-800">Name</label>
                      <Input
                        onChange={(event) =>
                          setDraft((current) =>
                            current ? { ...current, name: event.target.value } : current,
                          )
                        }
                        value={draft.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-800">Status</label>
                      <select
                        className="flex h-11 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        onChange={(event) =>
                          setDraft((current) =>
                            current ? { ...current, status: event.target.value } : current,
                          )
                        }
                        value={draft.status}
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="locked">Locked</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">
                      {props.kind === "budget" ? "Start date" : "Horizon months"}
                    </label>
                    <Input
                      min={props.kind === "forecast" ? 1 : undefined}
                      onChange={(event) =>
                        setDraft((current) =>
                          current
                            ? { ...current, secondaryValue: event.target.value }
                            : current,
                        )
                      }
                      type={props.kind === "budget" ? "date" : "number"}
                      value={draft.secondaryValue}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      leftIcon={<Save className="size-4" />}
                      loading={isPending}
                      onClick={() => saveItem(item.id)}
                      size="sm"
                      variant="secondary"
                    >
                      Save
                    </Button>
                    <Button
                      leftIcon={<X className="size-4" />}
                      onClick={() => {
                        setEditingId(null);
                        setDraft(null);
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        className="font-medium text-slate-950 transition hover:text-primary"
                        href={props.kind === "budget" ? `/budgets/${item.id}` : `/forecasts/${item.id}`}
                      >
                        {item.name}
                      </Link>
                      <Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {props.kind === "budget" && isBudgetItem(item)
                        ? item.startsOn
                          ? `Starts ${new Date(item.startsOn).toLocaleDateString("en-US")}`
                          : "No schedule yet"
                        : !isBudgetItem(item) && item.horizonMonths
                          ? `${item.horizonMonths} month horizon`
                          : "No horizon set"}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Updated {new Date(item.updatedAt).toLocaleString("en-US")}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={props.kind === "budget" ? `/budgets/${item.id}` : `/forecasts/${item.id}`}>
                        Open
                      </Link>
                    </Button>
                    <Button
                      leftIcon={<Pencil className="size-4" />}
                      onClick={() => beginEdit(item)}
                      size="sm"
                      variant="secondary"
                    >
                      Edit
                    </Button>
                    <Button
                      leftIcon={<Trash2 className="size-4" />}
                      loading={isPending}
                      onClick={() => deleteItem(item.id)}
                      size="sm"
                      variant="ghost"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
