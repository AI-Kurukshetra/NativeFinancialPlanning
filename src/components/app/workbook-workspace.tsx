"use client";

import {
  CheckCheck,
  Download,
  MessageSquare,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { WorkbookDetailItem } from "@/lib/server/app-data";
import type { UserRole } from "@/lib/types";

type WorkbookWorkspaceProps = {
  currentUserId: string | null;
  currentUserRole: UserRole | null;
  workbook: WorkbookDetailItem;
};

type CellSelection = {
  rowIndex: number;
  columnIndex: number;
};

function getCellKey(rowIndex: number, columnIndex: number) {
  return `${rowIndex}:${columnIndex}`;
}

function getColumnLabel(columnIndex: number) {
  let label = "";
  let current = columnIndex;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    current = Math.floor((current - 1) / 26);
  }

  return label;
}

export function WorkbookWorkspace({
  currentUserId,
  currentUserRole,
  workbook,
}: WorkbookWorkspaceProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedWorksheetId, setSelectedWorksheetId] = useState(
    workbook.worksheets[0]?.id ?? "",
  );
  const [selectedCell, setSelectedCell] = useState<CellSelection | null>({
    rowIndex: 1,
    columnIndex: 1,
  });
  const [commentBody, setCommentBody] = useState("");
  const [draftCells, setDraftCells] = useState<Record<string, string>>({});
  const [showResolvedComments, setShowResolvedComments] = useState(false);
  const [formulaValue, setFormulaValue] = useState("");
  const [workbookDraft, setWorkbookDraft] = useState({
    name: workbook.name,
    description: workbook.description,
    status: workbook.status,
  });
  const [isEditingWorkbook, setIsEditingWorkbook] = useState(false);
  const [newWorksheetName, setNewWorksheetName] = useState("");
  const [renamingWorksheetId, setRenamingWorksheetId] = useState<string | null>(null);
  const [worksheetRenameValue, setWorksheetRenameValue] = useState("");

  const canEditWorkbook =
    currentUserRole === "admin" || currentUserRole === "editor";

  useEffect(() => {
    setSelectedWorksheetId(workbook.worksheets[0]?.id ?? "");
  }, [workbook.worksheets]);

  useEffect(() => {
    setWorkbookDraft({
      name: workbook.name,
      description: workbook.description,
      status: workbook.status,
    });
  }, [workbook.description, workbook.name, workbook.status]);

  const selectedWorksheet =
    workbook.worksheets.find((worksheet) => worksheet.id === selectedWorksheetId) ??
    workbook.worksheets[0] ??
    null;

  const cellMap = useMemo(() => {
    const entries: Array<[string, string]> =
      selectedWorksheet?.cells.map((cell) => [
        getCellKey(cell.row_index, cell.column_index),
        cell.formula ?? cell.display_value ?? cell.raw_value ?? "",
      ]) ?? [];

    return new Map(entries);
  }, [selectedWorksheet]);

  useEffect(() => {
    if (!selectedCell) {
      setFormulaValue("");
      return;
    }

    const key = getCellKey(selectedCell.rowIndex, selectedCell.columnIndex);
    setFormulaValue(draftCells[key] ?? cellMap.get(key) ?? "");
  }, [cellMap, draftCells, selectedCell]);

  const rowCount = Math.max(
    12,
    selectedWorksheet?.cells.reduce((current, cell) => Math.max(current, cell.row_index), 0) ?? 0,
  );
  const columnCount = Math.max(
    8,
    selectedWorksheet?.cells.reduce((current, cell) => Math.max(current, cell.column_index), 0) ?? 0,
  );

  const selectedCellLabel = selectedCell
    ? `${getColumnLabel(selectedCell.columnIndex)}${selectedCell.rowIndex}`
    : "None";

  const selectedCellCommentCount = workbook.comments.filter((comment) => {
    if (!selectedWorksheet || !selectedCell) {
      return false;
    }

    return (
      comment.worksheet_id === selectedWorksheet.id &&
      comment.row_index === selectedCell.rowIndex &&
      comment.column_index === selectedCell.columnIndex
    );
  }).length;

  const filteredComments = workbook.comments
    .filter((comment) => {
      if (!selectedWorksheet) {
        return false;
      }

      if (comment.worksheet_id !== selectedWorksheet.id) {
        return false;
      }

      if (!selectedCell) {
        return true;
      }

      return (
        comment.row_index === selectedCell.rowIndex &&
        comment.column_index === selectedCell.columnIndex
      );
    })
    .filter((comment) => showResolvedComments || !comment.resolved_at);

  async function updateWorkbook() {
    const response = await fetch(`/api/workbooks/${workbook.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workbookDraft),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(result.error ?? "Failed to update workbook.");
      return;
    }

    setIsEditingWorkbook(false);
    startTransition(() => {
      router.refresh();
    });
    toast.success("Workbook details updated.");
  }

  async function createWorksheet() {
    if (!newWorksheetName.trim()) {
      toast.error("Enter a worksheet name.");
      return;
    }

    const response = await fetch(`/api/workbooks/${workbook.id}/worksheets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newWorksheetName }),
    });
    const result = (await response.json()) as {
      error?: string;
      data?: { id: string };
    };

    if (!response.ok || !result.data) {
      toast.error(result.error ?? "Failed to create worksheet.");
      return;
    }

    setNewWorksheetName("");
    setSelectedWorksheetId(result.data.id);
    setSelectedCell({ rowIndex: 1, columnIndex: 1 });
    startTransition(() => {
      router.refresh();
    });
    toast.success("Worksheet created.");
  }

  async function renameWorksheet() {
    if (!selectedWorksheet || !worksheetRenameValue.trim()) {
      toast.error("Enter a worksheet name.");
      return;
    }

    const response = await fetch(
      `/api/workbooks/${workbook.id}/worksheets/${selectedWorksheet.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: worksheetRenameValue }),
      },
    );
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(result.error ?? "Failed to rename worksheet.");
      return;
    }

    setRenamingWorksheetId(null);
    setWorksheetRenameValue("");
    startTransition(() => {
      router.refresh();
    });
    toast.success("Worksheet renamed.");
  }

  async function deleteWorksheet() {
    if (!selectedWorksheet) {
      return;
    }

    const response = await fetch(
      `/api/workbooks/${workbook.id}/worksheets/${selectedWorksheet.id}`,
      {
        method: "DELETE",
      },
    );
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(result.error ?? "Failed to delete worksheet.");
      return;
    }

    setRenamingWorksheetId(null);
    setWorksheetRenameValue("");
    startTransition(() => {
      router.refresh();
    });
    toast.success("Worksheet deleted.");
  }

  async function updateComment(
    commentId: string,
    payload: Record<string, unknown>,
    successMessage: string,
  ) {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(result.error ?? "Failed to update comment.");
      return;
    }

    startTransition(() => {
      router.refresh();
    });
    toast.success(successMessage);
  }

  async function deleteComment(commentId: string) {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(result.error ?? "Failed to delete comment.");
      return;
    }

    startTransition(() => {
      router.refresh();
    });
    toast.success("Comment deleted.");
  }

  async function persistCell(rowIndex: number, columnIndex: number, value: string) {
    if (!selectedWorksheet) {
      return;
    }

    const key = getCellKey(rowIndex, columnIndex);
    const existingValue = cellMap.get(key) ?? "";

    if (existingValue === value) {
      return;
    }

    const body =
      value.trim().length === 0
        ? {
            worksheetId: selectedWorksheet.id,
            cells: [{ rowIndex, columnIndex, clear: true }],
          }
        : {
            worksheetId: selectedWorksheet.id,
            cells: [
              {
                rowIndex,
                columnIndex,
                rawValue: value,
                displayValue: value.startsWith("=") ? null : value,
                formula: value.startsWith("=") ? value : null,
                valueType: value.startsWith("=") ? "formula" : "text",
              },
            ],
          };

    const response = await fetch("/api/cells", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(result.error ?? "Failed to save cell.");
      return;
    }

    setDraftCells((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    startTransition(() => {
      router.refresh();
    });
    toast.success("Cell saved.");
  }

  async function saveFormulaBar() {
    if (!selectedCell) {
      toast.error("Select a cell first.");
      return;
    }

    await persistCell(selectedCell.rowIndex, selectedCell.columnIndex, formulaValue);
  }

  async function createComment() {
    if (!selectedWorksheet || !selectedCell || commentBody.trim().length === 0) {
      toast.error("Select a cell and enter a comment.");
      return;
    }

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workbookId: workbook.id,
        worksheetId: selectedWorksheet.id,
        rowIndex: selectedCell.rowIndex,
        columnIndex: selectedCell.columnIndex,
        body: commentBody,
      }),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(result.error ?? "Failed to create comment.");
      return;
    }

    setCommentBody("");
    startTransition(() => {
      router.refresh();
    });
    toast.success("Comment added.");
  }

  async function createSnapshot() {
    const response = await fetch("/api/versions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workbookId: workbook.id,
        label: `Snapshot ${new Date().toLocaleString("en-US")}`,
      }),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(result.error ?? "Failed to create snapshot.");
      return;
    }

    startTransition(() => {
      router.refresh();
    });
    toast.success("Snapshot created.");
  }

  async function restoreVersion(versionId: string) {
    const response = await fetch(`/api/versions/${versionId}/restore`, {
      method: "POST",
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(result.error ?? "Failed to restore version.");
      return;
    }

    startTransition(() => {
      router.refresh();
    });
    toast.success("Workbook restored from snapshot.");
  }

  async function exportWorkbook(format: "json" | "csv") {
    const response = await fetch("/api/exports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workbookId: workbook.id,
        format,
      }),
    });
    const result = (await response.json()) as {
      error?: string;
      data?: {
        files: Array<{ filename: string; content: string; mimeType: string }>;
      };
    };

    if (!response.ok || !result.data) {
      toast.error(result.error ?? "Failed to export workbook.");
      return;
    }

    for (const file of result.data.files) {
      const blob = new Blob([file.content], { type: file.mimeType });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.filename;
      anchor.click();
      URL.revokeObjectURL(url);
    }

    toast.success(`Exported ${result.data.files.length} file(s).`);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <CardTitle>Workbook control room</CardTitle>
                <CardDescription>
                  Edit workbook metadata, manage worksheets, and drive updates from one place.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    workbook.status === "published"
                      ? "success"
                      : workbook.status === "in_review"
                        ? "warning"
                        : "secondary"
                  }
                >
                  {workbook.status.replace("_", " ")}
                </Badge>
                <Badge variant="secondary">{workbook.collaborators} collaborators</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {isEditingWorkbook ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Workbook name</label>
                    <Input
                      onChange={(event) =>
                        setWorkbookDraft((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      value={workbookDraft.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Description</label>
                    <textarea
                      className="min-h-28 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary"
                      onChange={(event) =>
                        setWorkbookDraft((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      value={workbookDraft.description}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Status</label>
                    <select
                      className="flex h-11 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      onChange={(event) =>
                        setWorkbookDraft((current) => ({
                          ...current,
                          status: event.target.value as WorkbookDetailItem["status"],
                        }))
                      }
                      value={workbookDraft.status}
                    >
                      <option value="draft">Draft</option>
                      <option value="in_review">In review</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      leftIcon={<Save className="size-4" />}
                      loading={isPending}
                      onClick={() => void updateWorkbook()}
                      size="sm"
                      variant="secondary"
                    >
                      Save details
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditingWorkbook(false);
                        setWorkbookDraft({
                          name: workbook.name,
                          description: workbook.description,
                          status: workbook.status,
                        });
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="space-y-2">
                  <p className="text-2xl font-semibold text-slate-950">{workbook.name}</p>
                  <p className="text-sm text-slate-600">
                    {workbook.description || "No workbook description added yet."}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Owned by {workbook.owner} · Updated{" "}
                    {new Date(workbook.updatedAt).toLocaleString("en-US")}
                  </p>
                </div>
                <div className="flex flex-wrap items-start justify-end gap-2">
                  {canEditWorkbook ? (
                    <Button
                      leftIcon={<Pencil className="size-4" />}
                      onClick={() => setIsEditingWorkbook(true)}
                      size="sm"
                      variant="secondary"
                    >
                      Edit details
                    </Button>
                  ) : null}
                </div>
              </div>
            )}

            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[26px] bg-slate-50/90 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Formula bar</p>
                <div className="mt-3 flex flex-col gap-3 md:flex-row">
                  <div className="flex h-11 min-w-24 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-slate-950">
                    {selectedCellLabel}
                  </div>
                  <Input
                    className="flex-1"
                    onChange={(event) => {
                      setFormulaValue(event.target.value);

                      if (selectedCell) {
                        const key = getCellKey(
                          selectedCell.rowIndex,
                          selectedCell.columnIndex,
                        );

                        setDraftCells((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }));
                      }
                    }}
                    placeholder="Type a value or formula like =SUM(B2:E2)"
                    value={formulaValue}
                  />
                  <Button
                    leftIcon={<Save className="size-4" />}
                    loading={isPending}
                    onClick={() => void saveFormulaBar()}
                    variant="secondary"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <div className="rounded-[26px] bg-slate-50/90 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Active cell</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs text-slate-500">Selection</p>
                    <p className="mt-2 font-semibold text-slate-950">{selectedCellLabel}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs text-slate-500">Comments</p>
                    <p className="mt-2 font-semibold text-slate-950">
                      {selectedCellCommentCount}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs text-slate-500">Snapshots</p>
                    <p className="mt-2 font-semibold text-slate-950">{workbook.versions.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle>Spreadsheet workspace</CardTitle>
                <CardDescription>
                  Switch worksheets, edit cells directly, and keep formulas preserved.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  leftIcon={<Save className="size-4" />}
                  onClick={() => void createSnapshot()}
                  size="sm"
                  variant="secondary"
                >
                  Save snapshot
                </Button>
                <Button
                  leftIcon={<Download className="size-4" />}
                  onClick={() => void exportWorkbook("json")}
                  size="sm"
                  variant="secondary"
                >
                  JSON
                </Button>
                <Button
                  leftIcon={<Download className="size-4" />}
                  onClick={() => void exportWorkbook("csv")}
                  size="sm"
                  variant="secondary"
                >
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {workbook.worksheets.map((worksheet) => {
                const worksheetCommentCount = workbook.comments.filter(
                  (comment) => comment.worksheet_id === worksheet.id && !comment.resolved_at,
                ).length;

                return (
                  <button
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                      worksheet.id === selectedWorksheetId
                        ? "bg-slate-950 text-white"
                        : "bg-white/75 text-slate-700"
                    }`}
                    key={worksheet.id}
                    onClick={() => {
                      setSelectedWorksheetId(worksheet.id);
                      setSelectedCell({ rowIndex: 1, columnIndex: 1 });
                    }}
                    type="button"
                  >
                    <span>{worksheet.name}</span>
                    {worksheetCommentCount > 0 ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          worksheet.id === selectedWorksheetId
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {worksheetCommentCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {canEditWorkbook ? (
              <div className="grid gap-4 rounded-[24px] bg-slate-50/90 p-4 lg:grid-cols-[1fr_auto]">
                <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                  <Input
                    onChange={(event) => setNewWorksheetName(event.target.value)}
                    placeholder="New worksheet name"
                    value={newWorksheetName}
                  />
                  <Button
                    leftIcon={<Plus className="size-4" />}
                    loading={isPending}
                    onClick={() => void createWorksheet()}
                    variant="secondary"
                  >
                    Add sheet
                  </Button>
                  {selectedWorksheet ? (
                    <Button
                      leftIcon={<Trash2 className="size-4" />}
                      loading={isPending}
                      onClick={() => void deleteWorksheet()}
                      variant="ghost"
                    >
                      Delete sheet
                    </Button>
                  ) : null}
                </div>

                {selectedWorksheet ? (
                  <div className="flex flex-wrap gap-2">
                    {renamingWorksheetId === selectedWorksheet.id ? (
                      <>
                        <Input
                          onChange={(event) => setWorksheetRenameValue(event.target.value)}
                          value={worksheetRenameValue}
                        />
                        <Button
                          leftIcon={<Save className="size-4" />}
                          loading={isPending}
                          onClick={() => void renameWorksheet()}
                          variant="secondary"
                        >
                          Save name
                        </Button>
                      </>
                    ) : (
                      <Button
                        leftIcon={<Pencil className="size-4" />}
                        onClick={() => {
                          setRenamingWorksheetId(selectedWorksheet.id);
                          setWorksheetRenameValue(selectedWorksheet.name);
                        }}
                        variant="ghost"
                      >
                        Rename sheet
                      </Button>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}

            {selectedWorksheet ? (
              <div className="overflow-auto rounded-3xl border border-white/55 bg-white/60">
                <div
                  className="grid gap-px bg-slate-200"
                  style={{
                    gridTemplateColumns: `88px repeat(${columnCount}, minmax(132px, 1fr))`,
                  }}
                >
                  <div className="bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Row
                  </div>
                  {Array.from({ length: columnCount }, (_, columnIndex) => (
                    <div
                      className="bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                      key={`header-${columnIndex + 1}`}
                    >
                      {getColumnLabel(columnIndex + 1)}
                    </div>
                  ))}

                  {Array.from({ length: rowCount }, (_, rowIndex) => (
                    <FragmentRow
                      cellMap={cellMap}
                      columnCount={columnCount}
                      draftCells={draftCells}
                      key={`row-${rowIndex + 1}`}
                      onCellBlur={(columnIndex, value) => {
                        void persistCell(rowIndex + 1, columnIndex, value);
                      }}
                      onCellChange={(columnIndex, value) => {
                        setDraftCells((current) => ({
                          ...current,
                          [getCellKey(rowIndex + 1, columnIndex)]: value,
                        }));
                      }}
                      onCellSelect={(columnIndex) =>
                        setSelectedCell({
                          rowIndex: rowIndex + 1,
                          columnIndex,
                        })
                      }
                      rowIndex={rowIndex + 1}
                      selectedCell={selectedCell}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                This workbook does not have any worksheets yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Review context</CardTitle>
            <CardDescription>
              Live context for the current sheet and selected cell.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-[24px] bg-white/75 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Worksheet</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {selectedWorksheet?.name ?? "No worksheet selected"}
              </p>
            </div>
            <div className="rounded-[24px] bg-white/75 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected cell</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{selectedCellLabel}</p>
              <p className="mt-2 break-all text-sm text-slate-600">
                {formulaValue || "No value in the selected cell yet."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle>Cell comments</CardTitle>
                <CardDescription>
                  {selectedCell
                    ? `Annotate ${selectedCellLabel} in the current worksheet.`
                    : "Select a cell in the grid to leave a comment."}
                </CardDescription>
              </div>
              <button
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
                onClick={() => setShowResolvedComments((current) => !current)}
                type="button"
              >
                {showResolvedComments ? "Hide resolved" : "Show resolved"}
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="min-h-28 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary"
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder="Explain the assumption, open question, or review note."
              value={commentBody}
            />
            <Button
              className="w-full"
              disabled={!selectedCell || commentBody.trim().length === 0 || isPending}
              leftIcon={<MessageSquare className="size-4" />}
              onClick={() => void createComment()}
              variant="secondary"
            >
              Add comment
            </Button>

            <div className="space-y-3">
              {filteredComments.length === 0 ? (
                <p className="text-sm text-slate-500">No comments for the current selection.</p>
              ) : (
                filteredComments.map((comment) => {
                  const canManageComment =
                    comment.author_id === currentUserId || currentUserRole === "admin";

                  return (
                    <div className="rounded-2xl bg-white/75 p-4" key={comment.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-slate-950">{comment.body}</p>
                          <p className="mt-2 text-xs text-slate-500">
                            {comment.row_index && comment.column_index
                              ? `R${comment.row_index} · ${getColumnLabel(comment.column_index)}`
                              : "Workbook comment"}
                            {comment.resolved_at ? " · Resolved" : " · Open"}
                          </p>
                        </div>
                      </div>

                      {canManageComment ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            leftIcon={<CheckCheck className="size-4" />}
                            onClick={() =>
                              void updateComment(
                                comment.id,
                                { resolved: !comment.resolved_at },
                                comment.resolved_at ? "Comment reopened." : "Comment resolved.",
                              )
                            }
                            size="sm"
                            variant="secondary"
                          >
                            {comment.resolved_at ? "Reopen" : "Resolve"}
                          </Button>
                          <Button
                            leftIcon={<Trash2 className="size-4" />}
                            onClick={() => void deleteComment(comment.id)}
                            size="sm"
                            variant="ghost"
                          >
                            Delete
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Version history</CardTitle>
            <CardDescription>Restore the workbook to any saved snapshot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {workbook.versions.length === 0 ? (
              <p className="text-sm text-slate-500">No snapshots saved yet.</p>
            ) : (
              workbook.versions.map((version) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white/75 p-4"
                  key={version.id}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-950">{version.label}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(version.created_at).toLocaleString("en-US")}
                    </p>
                  </div>
                  <Button
                    leftIcon={<RotateCcw className="size-4" />}
                    onClick={() => void restoreVersion(version.id)}
                    size="sm"
                    variant="secondary"
                  >
                    Restore
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FragmentRow({
  rowIndex,
  columnCount,
  cellMap,
  draftCells,
  selectedCell,
  onCellSelect,
  onCellChange,
  onCellBlur,
}: {
  rowIndex: number;
  columnCount: number;
  cellMap: Map<string, string>;
  draftCells: Record<string, string>;
  selectedCell: CellSelection | null;
  onCellSelect: (columnIndex: number) => void;
  onCellChange: (columnIndex: number, value: string) => void;
  onCellBlur: (columnIndex: number, value: string) => void;
}) {
  return (
    <>
      <div className="bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500">{rowIndex}</div>
      {Array.from({ length: columnCount }, (_, columnOffset) => {
        const columnIndex = columnOffset + 1;
        const key = getCellKey(rowIndex, columnIndex);
        const isSelected =
          selectedCell?.rowIndex === rowIndex &&
          selectedCell?.columnIndex === columnIndex;
        const value = draftCells[key] ?? cellMap.get(key) ?? "";

        return (
          <button
            className={`bg-white/85 p-0 text-left ${isSelected ? "ring-2 ring-slate-900" : ""}`}
            key={key}
            onClick={() => onCellSelect(columnIndex)}
            type="button"
          >
            <Input
              className="h-full rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              onBlur={(event) => {
                void onCellBlur(columnIndex, event.target.value);
              }}
              onChange={(event) => {
                onCellChange(columnIndex, event.target.value);
              }}
              value={value}
            />
          </button>
        );
      })}
    </>
  );
}
