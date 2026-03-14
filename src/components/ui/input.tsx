import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-11 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary",
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

