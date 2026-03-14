"use client";

import { Layers3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TemplatePageItem } from "@/lib/server/app-data";

type TemplateLibraryProps = {
  items: TemplatePageItem[];
};

export function TemplateLibrary({ items }: TemplateLibraryProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);

  function createTemplate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          description,
          isGlobal,
          workbookTemplate: {
            starterSheet: "Summary",
            createdFromUi: true,
          },
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to create template.");
        return;
      }

      toast.success("Template created.");
      setName("");
      setCategory("general");
      setDescription("");
      setIsGlobal(false);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Create template</CardTitle>
          <CardDescription>
            Save workbook blueprints for recurring planning cycles and onboarding
            flows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={createTemplate}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800" htmlFor="template-name">
                Template name
              </label>
              <Input
                id="template-name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Board deck starter"
                value={name}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800" htmlFor="template-category">
                Category
              </label>
              <Input
                id="template-category"
                onChange={(event) => setCategory(event.target.value)}
                placeholder="executive"
                value={category}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800" htmlFor="template-description">
                Description
              </label>
              <textarea
                className="min-h-28 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary"
                id="template-description"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="A lightweight starting point for monthly executive reporting."
                value={description}
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl bg-white/65 px-4 py-3 text-sm text-slate-700">
              <input
                checked={isGlobal}
                onChange={(event) => setIsGlobal(event.target.checked)}
                type="checkbox"
              />
              Make this visible beyond the current organization
            </label>

            <Button className="w-full" loading={isPending} type="submit">
              Create template
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template library</CardTitle>
          <CardDescription>
            Reusable planning and reporting structures available to the current
            workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">No templates created yet.</p>
          ) : (
            items.map((item) => (
              <div className="rounded-[28px] border border-white/55 bg-white/75 p-5" key={item.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-slate-950">{item.name}</p>
                  <Badge variant={item.scope === "global" ? "gradient" : "secondary"}>
                    {item.scope}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.description || "No description provided."}</p>
                <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <Layers3 className="size-4" />
                  {item.category} · Updated {new Date(item.updatedAt).toLocaleDateString("en-US")}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
