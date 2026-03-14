import { Bell, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function AppTopbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-white/55 bg-white/55 px-5 py-4 shadow-glass backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-slate-500">{subtitle}</p>
        <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex min-w-64 items-center gap-3 rounded-full border border-white/60 bg-white/70 px-4 py-2.5 text-sm text-slate-500">
          <Search className="size-4" />
          Search workbooks, reports, or owners
        </div>
        <button className="flex size-11 items-center justify-center rounded-full border border-white/60 bg-white/70">
          <Bell className="size-4 text-slate-700" />
        </button>
        <Badge variant="secondary">Starter Org</Badge>
      </div>
    </div>
  );
}

