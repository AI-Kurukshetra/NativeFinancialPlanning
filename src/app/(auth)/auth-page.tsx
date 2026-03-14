"use client";

import Link from "next/link";
import type { Route } from "next";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthPageProps = {
  mode: "login" | "signup";
};

function AuthContent({ mode }: AuthPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isLogin = mode === "login";
  const authError = searchParams.get("error");

  const toggleMode = () => {
    const next = searchParams.get("next");
    const safeNext = next?.startsWith("/") ? `?next=${encodeURIComponent(next)}` : "";
    const target = `${isLogin ? "/signup" : "/login"}${safeNext}` as Route;
    router.push(target);
  };

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader className="relative">
        <Link className="absolute left-6 top-6 text-sm text-slate-500" href="/">
          Back to site
        </Link>
        <div className="mt-8 space-y-2">
          <CardTitle className="text-3xl">
            {isLogin ? "Sign in to the workspace" : "Create a finance workspace"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Use your approved finance team account to access dashboards, workbooks, and reviews."
              : "Set up your organization and start collaborative financial planning in minutes."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLogin && authError ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {authError}
          </div>
        ) : null}
        <div className="relative min-h-[400px]">
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              isLogin ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 absolute inset-0 pointer-events-none",
            )}
          >
            <LoginForm onSwitch={toggleMode} />
          </div>
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              isLogin
                ? "translate-x-full opacity-0 absolute inset-0 pointer-events-none"
                : "translate-x-0 opacity-100",
            )}
          >
            <SignupForm onSwitch={toggleMode} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AuthFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-64 animate-pulse rounded bg-slate-200" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthPage({ mode }: AuthPageProps) {
  return (
    <Suspense fallback={<AuthFallback />}>
      <AuthContent mode={mode} />
    </Suspense>
  );
}
