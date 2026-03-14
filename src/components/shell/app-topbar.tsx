"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type AppTopbarProps = {
  title: string;
  subtitle: string;
  organizationName?: string;
  roleLabel?: string;
};

export function AppTopbar({
  title,
  subtitle,
  organizationName = "Workspace",
  roleLabel,
}: AppTopbarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadUnreadCount() {
      const response = await fetch("/api/notifications?unread=true", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const result = (await response.json()) as { data?: Array<{ id: string }> };

      if (isActive) {
        setUnreadCount(result.data?.length ?? 0);
      }
    }

    void loadUnreadCount();

    return () => {
      isActive = false;
    };
  }, []);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      const params = new URLSearchParams();

      if (query.trim().length > 0) {
        params.set("query", query.trim());
      }

      router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  return (
    <div className="glass-strong page-shell flex flex-col gap-4 rounded-[30px] px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-neutral-500">{subtitle}</p>
        <h1 className="text-3xl font-semibold text-black">{title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <form
          className="flex w-full items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-neutral-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:min-w-72 md:w-auto"
          onSubmit={handleSearchSubmit}
        >
          <Search className="size-4 shrink-0" />
          <input
            className="w-full bg-transparent text-black outline-none placeholder:text-neutral-400"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search workbooks by name, owner, or description"
            value={query}
          />
          <button className="sr-only" disabled={isPending} type="submit">
            Search
          </button>
        </form>
        <Link
          className="relative flex size-11 items-center justify-center rounded-full border border-black/10 bg-white transition-colors duration-200 hover:bg-neutral-100"
          href="/notifications"
        >
          <Bell className="size-4 text-neutral-700" />
          {unreadCount && unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-black px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Link>
        <ThemeToggle size="sm" />
        <Badge variant="secondary">
          {organizationName}
          {roleLabel ? ` · ${roleLabel}` : ""}
        </Badge>
      </div>
    </div>
  );
}
