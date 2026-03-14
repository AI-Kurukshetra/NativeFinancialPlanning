"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl text-sm font-medium transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ring-offset-background active:scale-[0.99] [&>*]:relative [&>*]:z-10 [&>*]:text-inherit [&_svg]:text-inherit",
  {
    variants: {
      variant: {
        primary:
          "border border-amber-300/70 bg-[linear-gradient(135deg,#fde68a,#f59e0b)] text-black shadow-[0_18px_40px_rgba(245,158,11,0.24)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/30 before:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_58%)] after:content-[''] hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#fef3c7,#f59e0b)] hover:shadow-[0_22px_52px_rgba(245,158,11,0.28)] dark:border-amber-200/40 dark:bg-[linear-gradient(135deg,#fde68a,#f59e0b)] dark:text-black dark:before:bg-white/26 dark:after:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_58%)] dark:hover:bg-[linear-gradient(135deg,#fef3c7,#f59e0b)]",
        default:
          "border border-amber-300/60 bg-[linear-gradient(135deg,#fef3c7,#fbbf24)] text-black shadow-[0_16px_36px_rgba(245,158,11,0.18)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/30 before:content-[''] hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#fef3c7,#f59e0b)] hover:shadow-[0_20px_44px_rgba(245,158,11,0.22)] dark:border-amber-200/40 dark:bg-[linear-gradient(135deg,#fef3c7,#fbbf24)] dark:text-black dark:before:bg-white/24 dark:hover:bg-[linear-gradient(135deg,#fef3c7,#f59e0b)]",
        secondary:
          "border border-black/10 bg-neutral-100 text-black shadow-[0_10px_24px_rgba(0,0,0,0.05)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/60 before:content-[''] hover:-translate-y-0.5 hover:border-black/18 hover:bg-neutral-200 dark:border-white/12 dark:bg-neutral-900 dark:text-white dark:before:bg-white/10 dark:hover:bg-neutral-800",
        ghost:
          "border border-transparent bg-transparent text-neutral-700 hover:bg-black/5 hover:text-black dark:text-neutral-300 dark:hover:bg-white/8 dark:hover:text-white",
        outline:
          "border border-black/14 bg-white/88 text-black shadow-[0_8px_20px_rgba(0,0,0,0.04)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-black/6 before:content-[''] hover:-translate-y-0.5 hover:border-black/28 hover:bg-neutral-100 dark:border-white/14 dark:bg-neutral-950 dark:text-white dark:before:bg-white/10 dark:hover:border-white/28 dark:hover:bg-neutral-900",
        gradient:
          "border border-black/12 bg-[linear-gradient(135deg,rgba(0,0,0,0.04),rgba(0,0,0,0.1))] text-black shadow-[0_14px_30px_rgba(0,0,0,0.06)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/40 before:content-[''] hover:-translate-y-0.5 hover:border-black/18 hover:bg-[linear-gradient(135deg,rgba(0,0,0,0.06),rgba(0,0,0,0.14))] dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.12))] dark:text-white dark:before:bg-white/10 dark:hover:border-white/16 dark:hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.16))]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-12 px-6 text-sm",
        xl: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          aria-disabled={isDisabled || undefined}
          data-loading={loading ? "" : undefined}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {!isDisabled && variant !== "ghost" ? (
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.14)_50%,transparent_80%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-[linear-gradient(120deg,transparent_20%,rgba(0,0,0,0.08)_50%,transparent_80%)]" />
        ) : null}
        {loading && (
          <svg
            className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        <span
          className={cn(
            "relative z-10 flex items-center gap-2",
            loading ? "invisible" : "",
          )}
        >
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
