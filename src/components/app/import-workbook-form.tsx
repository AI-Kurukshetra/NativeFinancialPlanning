"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function parseDelimitedRows(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      line.split("\t").map((value) => {
        const trimmed = value.trim();

        if (trimmed === "") {
          return null;
        }

        if (trimmed.toLowerCase() === "true") {
          return true;
        }

        if (trimmed.toLowerCase() === "false") {
          return false;
        }

        const numericValue = Number(trimmed);

        if (!Number.isNaN(numericValue) && trimmed !== "") {
          return numericValue;
        }

        return trimmed;
      }),
    );
}

export function ImportWorkbookForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [workbookName, setWorkbookName] = useState("");
  const [description, setDescription] = useState("");
  const [worksheetName, setWorksheetName] = useState("Imported Sheet");
  const [status, setStatus] = useState("draft");
  const [rowsText, setRowsText] = useState(
    "Metric\tJan\tFeb\tMar\nRevenue\t120000\t130000\t150000\nGross Margin\t=SUM(B2:D2)*0.38\t\t",
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const rows = parseDelimitedRows(rowsText);

    if (rows.length === 0) {
      toast.error("Paste at least one row of tabular data.");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workbookName,
          description,
          worksheetName,
          status,
          rows,
        }),
      });
      const result = (await response.json()) as {
        data?: { workbook: { id: string } };
        error?: string;
      };

      if (!response.ok || !result.data) {
        toast.error(result.error ?? "Failed to import workbook.");
        return;
      }

      toast.success("Workbook imported.");
      router.push(`/workbooks/${result.data.workbook.id}`);
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="import-workbook-name">
          Workbook name
        </label>
        <Input
          id="import-workbook-name"
          onChange={(event) => setWorkbookName(event.target.value)}
          placeholder="Imported operating model"
          value={workbookName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="import-worksheet-name">
            Worksheet name
          </label>
          <Input
            id="import-worksheet-name"
            onChange={(event) => setWorksheetName(event.target.value)}
            placeholder="Imported Sheet"
            value={worksheetName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="import-status">
            Status
          </label>
          <select
            className="flex h-11 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id="import-status"
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            <option value="draft">Draft</option>
            <option value="in_review">In review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="import-description">
          Description
        </label>
        <textarea
          className="min-h-24 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary"
          id="import-description"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Paste TSV data from sheets or exports to bootstrap a workbook quickly."
          value={description}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-slate-800" htmlFor="import-rows">
            Tabular data
          </label>
          <span className="text-xs text-slate-500">
            Paste tab-separated rows. Values starting with `=` are stored as formulas.
          </span>
        </div>
        <textarea
          className="min-h-52 w-full rounded-[28px] border border-white/60 bg-white/75 px-4 py-4 font-mono text-sm text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary"
          id="import-rows"
          onChange={(event) => setRowsText(event.target.value)}
          placeholder={"Metric\tJan\tFeb\tMar"}
          value={rowsText}
        />
      </div>

      <Button
        className="w-full sm:w-auto"
        disabled={workbookName.trim().length < 2}
        leftIcon={<Upload className="size-4" />}
        loading={isPending}
        type="submit"
      >
        Import workbook
      </Button>
    </form>
  );
}
