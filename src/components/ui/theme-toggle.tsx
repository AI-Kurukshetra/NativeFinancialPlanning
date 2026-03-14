"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function ThemeToggle({
  variant = "ghost",
  size = "default",
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const sizeClasses = {
    default: {
      frame: "h-12 p-1",
      segment: "h-10 min-w-[4.8rem] px-3",
      icon: "size-4",
      label: "text-[11px]",
    },
    sm: {
      frame: "h-10 p-1",
      segment: "h-8 min-w-[4.2rem] px-2.5",
      icon: "size-3.5",
      label: "text-[10px]",
    },
    lg: {
      frame: "h-14 p-1.5",
      segment: "h-11 min-w-[5.2rem] px-3.5",
      icon: "size-[18px]",
      label: "text-xs",
    },
  }[size];

  const variantClasses = {
    default:
      "border border-black bg-black/96 text-white shadow-[0_16px_32px_rgba(0,0,0,0.18)] dark:border-white dark:bg-white dark:text-black dark:shadow-[0_16px_32px_rgba(255,255,255,0.08)]",
    ghost:
      "border border-black/12 bg-white/94 text-black shadow-[0_12px_28px_rgba(0,0,0,0.08)] dark:border-white/12 dark:bg-black/94 dark:text-white dark:shadow-[0_12px_28px_rgba(0,0,0,0.32)]",
    outline:
      "border border-black/14 bg-white/92 text-black shadow-[0_10px_24px_rgba(0,0,0,0.06)] dark:border-white/14 dark:bg-black/92 dark:text-white dark:shadow-[0_10px_24px_rgba(0,0,0,0.28)]",
  }[variant];

  return (
    <div
      aria-label="Theme switcher"
      className={cn("inline-flex items-center gap-1 rounded-full", sizeClasses.frame, variantClasses, className)}
      role="tablist"
    >
      {([
        ["light", Sun, "Light"],
        ["dark", Moon, "Dark"],
      ] as const).map(([value, Icon, label]) => {
        const active = theme === value;

        return (
          <button
            aria-selected={active}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-full border transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.99]",
              sizeClasses.segment,
              active
                ? "border-black bg-black text-white shadow-[0_12px_24px_rgba(0,0,0,0.14)] dark:border-white dark:bg-white dark:text-black dark:shadow-[0_12px_24px_rgba(255,255,255,0.08)]"
                : "border-transparent bg-transparent text-neutral-500 hover:bg-black/5 hover:text-black dark:text-neutral-400 dark:hover:bg-white/8 dark:hover:text-white"
            )}
            key={value}
            onClick={() => setTheme(value)}
            role="tab"
            title={`Switch to ${label.toLowerCase()} mode`}
            type="button"
          >
            <Icon className={cn(sizeClasses.icon)} />
            <span className={cn("font-medium uppercase tracking-[0.18em]", sizeClasses.label)}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
