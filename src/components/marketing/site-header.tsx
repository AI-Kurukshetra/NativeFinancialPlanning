"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { marketingNav } from "@/lib/config/navigation";
import { BrandMark } from "@/components/branding/brand-mark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-white/96 backdrop-blur-2xl dark:border-white/10 dark:bg-black/96">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:gap-6 sm:px-6 lg:px-8">
        <Link href="/" className="group flex-shrink-0">
          <div className="rounded-full px-1 py-1 transition-transform duration-200 group-hover:translate-x-0.5">
            <BrandMark showTagline={false} />
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              className="group relative text-sm font-medium text-neutral-700 transition-colors duration-200 hover:text-black dark:text-neutral-300 dark:hover:text-white"
              href={item.href}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-black transition-all duration-200 group-hover:w-full dark:bg-white" />
            </Link>
          ))}
          <ThemeToggle size="sm" />
          <Button asChild size="lg" variant="primary" className="flex-shrink-0">
            <Link href="/signup">
              Start Planning
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden flex-shrink-0">
          <ThemeToggle size="sm" />
          <button
            className="flex size-10 items-center justify-center rounded-full border border-black/12 bg-white transition-colors duration-200 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/10 dark:bg-black dark:hover:bg-neutral-950 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="animate-slide-down border-b border-black/8 bg-white/98 px-4 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/98 lg:hidden">
          <nav className="flex flex-col gap-4">
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                className="group block py-2 text-base font-medium text-neutral-700 transition-colors duration-200 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
                <span className="block h-px w-0 bg-black transition-all duration-200 group-hover:w-full dark:bg-white" />
              </Link>
            ))}
            <Button asChild className="mt-2 w-full" size="lg" variant="primary">
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                Start Planning
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
