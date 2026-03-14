"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { BrandMark } from "@/components/branding/brand-mark";
import { appNav } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  organizationName: string;
  userName: string;
  userEmail: string;
};

export function AppSidebar({
  organizationName,
  userName,
  userEmail,
}: AppSidebarProps) {
  const pathname = usePathname();
  const initials = userName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <aside className="hidden w-80 shrink-0 border-r border-black/8 bg-white/96 px-6 py-7 backdrop-blur-2xl dark:border-white/8 dark:bg-black/96 lg:flex lg:flex-col">
      <Link className="mb-8 flex items-center gap-3" href="/">
        <BrandMark showWordmark={false} />
      </Link>

      <div className="mb-6 rounded-[28px] border border-black/8 bg-white p-4 shadow-[0_10px_28px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-black dark:shadow-[0_10px_28px_rgba(0,0,0,0.32)]">
        <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
          Active workspace
        </p>
        <p className="mt-2 text-lg font-semibold text-black dark:text-white">
          {organizationName}
        </p>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{userName}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{userEmail}</p>
      </div>

      <nav className="space-y-2.5">
        {appNav.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              className={cn(
                "block rounded-[24px] border px-4 py-3 transition-[transform,background-color,border-color,color,box-shadow] duration-200",
                isActive
                  ? "border-black/14 bg-neutral-100 text-black shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:border-white/14 dark:bg-neutral-900 dark:text-white dark:shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
                  : "border-black/8 bg-white text-neutral-700 hover:-translate-y-0.5 hover:border-black/16 hover:bg-neutral-50 dark:border-white/8 dark:bg-black dark:text-neutral-300 dark:hover:bg-neutral-950",
              )}
              href={item.href}
              key={item.href}
            >
              <p className="text-sm font-medium">{item.label}</p>
              <p
                className={cn(
                  "mt-1 text-xs",
                  isActive ? "text-neutral-600 dark:text-neutral-300" : "text-neutral-500 dark:text-neutral-400",
                )}
              >
                {item.description}
              </p>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 rounded-[28px] border border-black/8 bg-neutral-50/92 p-4 shadow-[0_10px_28px_rgba(0,0,0,0.04)] dark:border-white/8 dark:bg-neutral-950">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-black text-sm font-semibold text-white dark:border-white/10 dark:bg-white dark:text-black">
            {initials || "NF"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-black dark:text-white">{userName}</p>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{userEmail}</p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
