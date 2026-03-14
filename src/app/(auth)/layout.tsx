import type { ReactNode } from "react";

import { AuthAtmosphere } from "@/components/auth/auth-atmosphere";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-10">
      <AuthAtmosphere />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle variant="outline" size="default" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl items-center justify-center">
        {children}
      </div>
    </div>
  );
}
