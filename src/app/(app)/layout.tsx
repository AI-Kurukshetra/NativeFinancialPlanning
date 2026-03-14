import type { ReactNode } from "react";

import { AppSidebar } from "@/components/shell/app-sidebar";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <AppSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
