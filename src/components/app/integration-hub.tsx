"use client";

import { Cable, DatabaseZap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { IntegrationPageItem } from "@/lib/server/app-data";

type IntegrationHubProps = {
  items: IntegrationPageItem[];
};

export function IntegrationHub({ items }: IntegrationHubProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [sourceType, setSourceType] = useState("erp");
  const [configText, setConfigText] = useState('{\n  "syncMode": "manual"\n}');

  function createIntegration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let config: Record<string, unknown> = {};

    try {
      config = JSON.parse(configText) as Record<string, unknown>;
    } catch {
      toast.error("Integration config must be valid JSON.");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          sourceType,
          config,
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to create integration.");
        return;
      }

      toast.success("Integration created.");
      setName("");
      setSourceType("erp");
      setConfigText('{\n  "syncMode": "manual"\n}');
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Register source</CardTitle>
          <CardDescription>
            Create a backend-backed data source record for imports and future sync
            jobs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={createIntegration}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800" htmlFor="integration-name">
                Connection name
              </label>
              <Input
                id="integration-name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Oracle ERP mirror"
                value={name}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800" htmlFor="integration-source">
                Source type
              </label>
              <Input
                id="integration-source"
                onChange={(event) => setSourceType(event.target.value)}
                placeholder="erp"
                value={sourceType}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800" htmlFor="integration-config">
                Config JSON
              </label>
              <textarea
                className="min-h-32 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-3 font-mono text-sm text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary"
                id="integration-config"
                onChange={(event) => setConfigText(event.target.value)}
                value={configText}
              />
            </div>

            <Button className="w-full" loading={isPending} type="submit">
              Create integration
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected sources</CardTitle>
          <CardDescription>
            Current integration records tracked in the active organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">No integrations registered yet.</p>
          ) : (
            items.map((item) => (
              <div className="rounded-[28px] border border-white/55 bg-white/75 p-5" key={item.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-slate-950">{item.name}</p>
                  <Badge variant="secondary">{item.sourceType}</Badge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Object.entries(item.config).length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      No config stored.
                    </div>
                  ) : (
                    Object.entries(item.config).map(([key, value]) => (
                      <div className="rounded-2xl bg-slate-50 px-4 py-3" key={key}>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{key}</p>
                        <p className="mt-2 text-sm text-slate-700">{String(value)}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {item.sourceType === "warehouse" ? (
                    <DatabaseZap className="size-4" />
                  ) : (
                    <Cable className="size-4" />
                  )}
                  Updated {new Date(item.updatedAt).toLocaleDateString("en-US")}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
