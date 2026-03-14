"use client";

import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200",
  {
    variants: {
      variant: {
        default:
          "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black",
        secondary:
          "border-black/10 bg-white text-neutral-700 dark:border-white/12 dark:bg-black dark:text-neutral-200",
        success:
          "border-black/14 bg-black/6 text-black dark:border-white/14 dark:bg-white/10 dark:text-white",
        warning:
          "border-black/14 bg-black/6 text-black dark:border-white/14 dark:bg-white/10 dark:text-white",
        destructive:
          "border-black/14 bg-black/6 text-black dark:border-white/14 dark:bg-white/10 dark:text-white",
        outline:
          "border-black/20 bg-transparent text-neutral-700 dark:border-white/18 dark:text-neutral-200",
        gradient:
          "border-black/12 bg-[linear-gradient(135deg,rgba(0,0,0,0.06),rgba(0,0,0,0.12))] text-black dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.14))] dark:text-white",
      },
      size: {
        sm: "px-2.5 py-1 text-[10px]",
        md: "px-3 py-1 text-[11px]",
        lg: "px-4 py-1.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  dot?: boolean;
  dotColor?: string;
}

export function Badge({
  className,
  variant,
  size = "md",
  animate = false,
  dot = false,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size }),
        animate && "animate-scale-in",
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex size-2">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dotColor || "bg-current"} opacity-55`}
          />
          <span
            className={`relative inline-flex size-2 rounded-full ${dotColor || "bg-current"}`}
          />
        </span>
      )}
      {children}
    </div>
  );
}

export { badgeVariants };
