import type { ReactNode } from "react";

import { SiteHeader } from "@/components/marketing/site-header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main>{children}</main>

      <footer className="border-t border-black/8 bg-white py-8 backdrop-blur-xl dark:border-white/10 dark:bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            © {new Date().getFullYear()} Native FP&A. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-neutral-600 transition-colors duration-200 hover:text-black dark:text-neutral-400 dark:hover:text-white"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-neutral-600 transition-colors duration-200 hover:text-black dark:text-neutral-400 dark:hover:text-white"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-neutral-600 transition-colors duration-200 hover:text-black dark:text-neutral-400 dark:hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
