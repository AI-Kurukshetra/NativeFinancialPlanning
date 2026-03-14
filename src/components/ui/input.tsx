import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-11 w-full rounded-2xl border border-black/12 bg-white px-4 py-2 text-sm text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-neutral-400 focus-visible:border-black focus-visible:ring-4 focus-visible:ring-black/8 dark:border-white/14 dark:bg-black dark:text-white dark:placeholder:text-neutral-500 dark:focus-visible:border-white dark:focus-visible:ring-white/10",
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
