"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNav } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/50 bg-white/45 p-6 backdrop-blur-xl lg:block">
      <Link className="mb-10 flex items-center gap-3" href="/">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
          FP
        </div>
        <div>
          <p className="font-medium text-slate-950">Excel-Native FP&amp;A</p>
          <p className="text-xs text-slate-500">Planning workspace</p>
        </div>
      </Link>

      <nav className="space-y-2">
        {appNav.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              className={cn(
                "block rounded-2xl px-4 py-3 transition",
                isActive ? "bg-slate-950 text-white" : "bg-white/55 text-slate-700 hover:bg-white/80",
              )}
              href={item.href}
              key={item.href}
            >
              <p className="text-sm font-medium">{item.label}</p>
              <p className={cn("mt-1 text-xs", isActive ? "text-white/70" : "text-slate-500")}>{item.description}</p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
