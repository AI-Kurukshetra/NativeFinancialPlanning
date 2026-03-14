import Link from "next/link";

import { marketingNav } from "@/lib/config/navigation";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            FP
          </div>
          <div>
            <p className="font-medium text-slate-950">Excel-Native FP&amp;A</p>
            <p className="text-xs text-slate-500">Where spreadsheets meet strategy</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {marketingNav.map((item) => (
            <Link className="text-sm text-slate-700 transition hover:text-slate-950" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Button asChild className="hidden md:inline-flex">
            <Link href="/signup">Request Access</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
