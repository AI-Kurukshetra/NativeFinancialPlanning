"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createWorkbookSchema,
  type CreateWorkbookInput,
} from "@/lib/schemas/workbooks";

type CreateWorkbookFormValues = z.input<typeof createWorkbookSchema>;

export function NewWorkbookForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateWorkbookFormValues, unknown, CreateWorkbookInput>({
    resolver: zodResolver(createWorkbookSchema),
    defaultValues: {
      name: "",
      description: "",
      initialWorksheetName: "Sheet 1",
      status: "draft",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const response = await fetch("/api/workbooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as {
        data?: { id: string };
        error?: string;
      };

      if (!response.ok || !result.data) {
        toast.error(result.error ?? "Failed to create workbook.");
        return;
      }

      toast.success("Workbook created.");
      router.push(`/workbooks/${result.data.id}`);
      router.refresh();
    });
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="workbook-name">
          Workbook name
        </label>
        <Input id="workbook-name" placeholder="FY27 Operating Plan" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-sm text-rose-600">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="workbook-description">
          Description
        </label>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary"
          id="workbook-description"
          placeholder="Core workbook for revenue, headcount, and opex planning."
          {...form.register("description")}
        />
        {form.formState.errors.description ? (
          <p className="text-sm text-rose-600">{form.formState.errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="worksheet-name">
            First worksheet
          </label>
          <Input id="worksheet-name" placeholder="Summary" {...form.register("initialWorksheetName")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="workbook-status">
            Status
          </label>
          <select
            className="flex h-11 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id="workbook-status"
            {...form.register("status")}
          >
            <option value="draft">Draft</option>
            <option value="in_review">In review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <Button className="w-full sm:w-auto" disabled={isPending} type="submit">
        {isPending ? "Creating workbook..." : "Create workbook"}
      </Button>
    </form>
  );
}
