"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthPageProps = {
  mode: "login" | "signup";
};

function AuthContent({ mode }: AuthPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isLogin = mode === "login";
  const authError = searchParams.get("error");
  const panelClassName = cn(
    "w-full",
    isLogin ? "max-w-[29rem]" : "max-w-[33rem]",
  );

  const toggleMode = () => {
    const next = searchParams.get("next");
    const safeNext = next?.startsWith("/")
      ? `?next=${encodeURIComponent(next)}`
      : "";
    const target = `${isLogin ? "/signup" : "/login"}${safeNext}` as Route;
    router.push(target);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={panelClassName}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <motion.div layout transition={{ duration: 0.32, ease: "easeInOut" }}>
        <Card className="overflow-hidden border-black/10 bg-white/82 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/12 dark:bg-black/74 dark:shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
          <CardHeader className="relative space-y-4 border-b border-black/6 pb-5 dark:border-white/8">
            <Link
              className="text-sm text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
              href="/"
            >
              Back to site
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-black/8 bg-white/74 px-3 py-1 text-[11px] tracking-[0.22em] text-neutral-500 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-white/10 dark:bg-white/6 dark:text-neutral-300 dark:shadow-none">
                Workspace access
              </div>
              <div className="rounded-full border border-black/8 bg-white/58 px-3 py-1 text-[11px] tracking-[0.22em] text-neutral-500 uppercase dark:border-white/10 dark:bg-white/6 dark:text-neutral-300">
                {isLogin ? "Login" : "Signup"}
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl leading-tight">
                {isLogin
                  ? "Sign in to the workspace"
                  : "Create a finance workspace"}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? "Use your approved finance team account to access dashboards, workbooks, and reviews."
                  : "Set up your organization and start collaborative financial planning in minutes."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  x: isLogin ? -18 : 18,
                  filter: "blur(6px)",
                }}
                initial={{
                  opacity: 0,
                  x: isLogin ? 18 : -18,
                  filter: "blur(8px)",
                }}
                key={mode}
                transition={{ duration: 0.26, ease: "easeInOut" }}
              >
                {isLogin && authError ? (
                  <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-950/30 dark:text-rose-200">
                    {authError}
                  </div>
                ) : null}
                {isLogin ? (
                  <LoginForm onSwitch={toggleMode} />
                ) : (
                  <SignupForm onSwitch={toggleMode} />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function AuthFallback() {
  return (
    <Card className="w-full max-w-[29rem] border-black/10 bg-white/82 backdrop-blur-2xl dark:border-white/12 dark:bg-black/74">
      <CardHeader>
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-64 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-10 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-10 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-10 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
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
