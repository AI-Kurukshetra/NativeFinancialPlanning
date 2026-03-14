"use client";

import { motion } from "framer-motion";
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
  const themes = [
    ["light", Sun, "Light"],
    ["dark", Moon, "Dark"],
  ] as const;

  const sizeClasses = {
    default: {
      frame: "h-12 min-w-[10rem] p-1",
      segment: "h-10 min-w-[4.8rem] px-3",
      icon: "size-4",
      label: "text-[11px]",
    },
    sm: {
      frame: "h-10 min-w-[8.8rem] p-1",
      segment: "h-8 min-w-[4.2rem] px-2.5",
      icon: "size-3.5",
      label: "text-[10px]",
    },
    lg: {
      frame: "h-14 min-w-[10.8rem] p-1.5",
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
      className={cn(
        "relative inline-grid grid-cols-2 items-center gap-1 rounded-full transition-[background-color,border-color,box-shadow,color] duration-300 ease-out",
        sizeClasses.frame,
        variantClasses,
        className,
      )}
      role="tablist"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-1 rounded-full border border-black bg-black shadow-[0_12px_24px_rgba(0,0,0,0.14)] dark:border-white dark:bg-white dark:shadow-[0_12px_24px_rgba(255,255,255,0.08)]"
        initial={false}
        animate={{
          left: theme === "light" ? "4px" : "calc(50% + 2px)",
          right: theme === "light" ? "calc(50% + 2px)" : "4px",
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      />
      {themes.map(([value, Icon, label]) => {
        const active = theme === value;

        return (
          <button
            aria-selected={active}
            className={cn(
              "focus-visible:ring-ring relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full border border-transparent transition-[transform,color] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99]",
              sizeClasses.segment,
              active
                ? "text-white dark:text-black"
                : "border-transparent bg-transparent text-neutral-500 hover:bg-black/5 hover:text-black dark:text-neutral-400 dark:hover:bg-white/8 dark:hover:text-white",
            )}
            key={value}
            onClick={() => setTheme(value)}
            role="tab"
            title={`Switch to ${label.toLowerCase()} mode`}
            type="button"
          >
            <Icon className={cn(sizeClasses.icon)} />
            <span
              className={cn(
                "font-medium tracking-[0.18em] uppercase",
                sizeClasses.label,
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
