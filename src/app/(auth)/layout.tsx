import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-hero-radial" />
      <div className="absolute left-12 top-24 -z-10 size-72 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="absolute bottom-10 right-10 -z-10 size-72 rounded-full bg-emerald-200/35 blur-3xl" />
      {children}
    </div>
  );
}
