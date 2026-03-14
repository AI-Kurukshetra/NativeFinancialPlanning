"use client";

import Link from "next/link";
import { BellDot, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { NotificationPageItem } from "@/lib/server/app-data";

type NotificationCenterProps = {
  items: NotificationPageItem[];
  unreadCount: number;
};

export function NotificationCenter({
  items,
  unreadCount,
}: NotificationCenterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const unreadItems = items.filter((item) => !item.readAt);

  function markAllAsRead() {
    startTransition(async () => {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ readAll: true }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to mark all notifications as read.");
        return;
      }

      toast.success("All notifications marked as read.");
      router.refresh();
    });
  }

  function markNotification(id: string, read: boolean) {
    startTransition(async () => {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to update notification.");
        return;
      }

      toast.success(read ? "Notification marked as read." : "Notification reopened.");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>
              Workflow, comment, and system notifications persisted by the live backend.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={unreadCount > 0 ? "warning" : "secondary"}>
              {unreadCount} unread
            </Badge>
            <Button
              disabled={unreadItems.length === 0}
              loading={isPending}
              onClick={markAllAsRead}
              size="sm"
              variant="ghost"
            >
              Mark all read
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/60 bg-white/45 p-6 text-sm text-slate-600">
            No notifications yet.
          </div>
        ) : (
          items.map((item) => (
            <div className="rounded-[28px] border border-white/55 bg-white/75 p-5" key={item.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-slate-950">{item.title}</p>
                    <Badge variant={item.readAt ? "secondary" : "gradient"}>
                      {item.kind}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{item.body || "No message body."}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {new Date(item.createdAt).toLocaleString("en-US")}
                  </p>
                </div>
                <Button
                  leftIcon={item.readAt ? <BellDot className="size-4" /> : <CheckCheck className="size-4" />}
                  loading={isPending}
                  onClick={() => markNotification(item.id, !item.readAt)}
                  size="sm"
                  variant="secondary"
                >
                  {item.readAt ? "Mark unread" : "Mark read"}
                </Button>
              </div>
              {item.link ? (
                <div className="mt-4">
                  <Button asChild size="sm" variant="outline">
                    <Link href={item.link}>Open related item</Link>
                  </Button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
