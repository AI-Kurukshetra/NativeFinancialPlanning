"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCcw, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type InternalServerErrorProps = {
  onRetry?: () => void;
};

export function InternalServerError({
  onRetry,
}: InternalServerErrorProps) {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-hero-radial" />
      <div className="absolute left-12 top-20 -z-10 size-72 rounded-full bg-rose-200/35 blur-3xl" />
      <div className="absolute bottom-10 right-10 -z-10 size-72 rounded-full bg-amber-200/35 blur-3xl" />

      <Card className="w-full max-w-xl border-rose-200/60 bg-white/80 shadow-glass backdrop-blur-xl">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-rose-100">
            <ShieldAlert className="size-8 text-rose-600" />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
            Internal Server Error
          </p>
          <h1 className="mb-3 text-3xl font-semibold text-slate-950">
            There might be something wrong
          </h1>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            We&apos;re trying to be back. If this keeps happening, contact the
            administrator and share what you were doing before the error.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {onRetry ? (
              <Button onClick={onRetry} type="button">
                <RefreshCcw className="mr-2 size-4" />
                Try again
              </Button>
            ) : null}
            <Button onClick={() => router.back()} type="button" variant="outline">
              Go back
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
