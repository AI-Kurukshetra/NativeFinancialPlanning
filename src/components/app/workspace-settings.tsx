"use client";

import { Building2, Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { WorkspacePageItem } from "@/lib/server/app-data";
import type { CurrentWorkspaceContext } from "@/lib/types";

type WorkspaceSettingsProps = {
  context: CurrentWorkspaceContext;
  items: WorkspacePageItem[];
};

export function WorkspaceSettings({ context, items }: WorkspaceSettingsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [makeDefault, setMakeDefault] = useState(true);

  function createOrganization(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug: slug || undefined,
          makeDefault,
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to create organization.");
        return;
      }

      toast.success("Workspace created.");
      setName("");
      setSlug("");
      setMakeDefault(true);
      router.refresh();
    });
  }

  function setDefaultOrganization(id: string) {
    startTransition(async () => {
      const response = await fetch(`/api/organizations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ makeDefault: true }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to switch workspace.");
        return;
      }

      toast.success("Default workspace updated.");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Create workspace</CardTitle>
          <CardDescription>
            Bootstrap a new organization so the rest of the app can work against
            a real org-scoped backend context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={createOrganization}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800" htmlFor="organization-name">
                Organization name
              </label>
              <Input
                id="organization-name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Northwind Finance"
                value={name}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800" htmlFor="organization-slug">
                Preferred slug
              </label>
              <Input
                id="organization-slug"
                onChange={(event) => setSlug(event.target.value)}
                placeholder="northwind-finance"
                value={slug}
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl bg-white/65 px-4 py-3 text-sm text-slate-700">
              <input
                checked={makeDefault}
                onChange={(event) => setMakeDefault(event.target.checked)}
                type="checkbox"
              />
              Make this the default workspace for the current user
            </label>

            <Button className="w-full" loading={isPending} type="submit">
              Create workspace
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace access</CardTitle>
          <CardDescription>
            Review memberships, switch the active default workspace, and confirm
            the org context the UI is using.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/60 bg-white/45 p-6 text-sm text-slate-600">
              No organization memberships were found for this account yet.
            </div>
          ) : (
            items.map((item) => (
              <div className="rounded-[28px] border border-white/55 bg-white/75 p-5" key={item.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-950">{item.name}</p>
                      {item.isCurrent ? <Badge variant="gradient">Current</Badge> : null}
                      {item.isDefault ? <Badge variant="success">Default</Badge> : null}
                    </div>
                    <p className="text-sm text-slate-600">
                      {item.slug} · {item.memberCount} members · {item.role}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Joined {new Date(item.joinedAt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                  {item.isDefault ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <Check className="size-4" />
                      Default workspace
                    </div>
                  ) : (
                    <Button
                      loading={isPending}
                      onClick={() => setDefaultOrganization(item.id)}
                      size="sm"
                      variant="secondary"
                    >
                      Switch default
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="rounded-[28px] bg-slate-950 px-5 py-4 text-white">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-white/10 p-2">
                {context.organization ? (
                  <Building2 className="size-4" />
                ) : (
                  <Sparkles className="size-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {context.organization?.name ?? "No active organization yet"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {context.organization
                    ? "The app shell is currently resolving data against this workspace."
                    : "Create or switch to a default workspace to enable workbook, planning, and reporting flows."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
