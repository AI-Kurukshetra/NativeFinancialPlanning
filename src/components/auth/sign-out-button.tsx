"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        toast.error(payload?.error ?? "Unable to sign out right now.");
        return;
      }

      router.replace("/login");
      router.refresh();
    });
  };

  return (
    <Button
      className="h-12 w-full justify-between rounded-[20px] px-4"
      disabled={isPending}
      onClick={handleSignOut}
      type="button"
      variant="outline"
    >
      <span className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full border border-black/10 bg-black text-white dark:border-white/10 dark:bg-white dark:text-black">
          <LogOut className="size-4" />
        </span>
        <span className="text-left">
          <span className="block text-sm font-medium">{isPending ? "Signing out..." : "Sign out"}</span>
          <span className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            Leave workspace
          </span>
        </span>
      </span>
      <span className="text-lg leading-none text-neutral-400 dark:text-neutral-500">
        →
      </span>
    </Button>
  );
}
