"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupSchema, type SignupSchema } from "@/lib/schemas/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SignupFormProps = {
  onSwitch?: () => void;
};

export function SignupForm({ onSwitch }: SignupFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      organizationName: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });
  const acceptTerms = form.watch("acceptTerms");

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const emailRedirectUrl = new URL(
        "/api/auth/callback",
        window.location.origin,
      );
      emailRedirectUrl.searchParams.set("next", "/dashboard");

      if (!supabase) {
        toast.error(
          "Configure Supabase environment variables to enable authentication.",
        );
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            organization_name: values.organizationName,
          },
          emailRedirectTo: emailRedirectUrl.toString(),
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.session) {
        toast.success("Workspace created.");
        router.push("/dashboard");
        router.refresh();
        return;
      }

      toast.success("Check your inbox to confirm the account.");
      router.push("/login");
    });
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
          htmlFor="fullName"
        >
          Full name
        </label>
        <Input
          id="fullName"
          placeholder="Aarav Sharma"
          {...form.register("fullName")}
        />
        {form.formState.errors.fullName ? (
          <p className="text-sm text-rose-600">
            {form.formState.errors.fullName.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
          htmlFor="organizationName"
        >
          Organization
        </label>
        <Input
          id="organizationName"
          placeholder="Northwind Finance"
          {...form.register("organizationName")}
        />
        {form.formState.errors.organizationName ? (
          <p className="text-sm text-rose-600">
            {form.formState.errors.organizationName.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
          htmlFor="email"
        >
          Work email
        </label>
        <Input
          id="email"
          placeholder="finance@company.com"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-rose-600">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
          htmlFor="password"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Minimum 8 characters"
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-rose-600">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-neutral-700 dark:border-white/12 dark:bg-black/40 dark:text-neutral-300">
          <label className="flex items-start gap-3" htmlFor="acceptTerms">
            <input
              id="acceptTerms"
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 rounded border-black/20 text-black accent-black dark:border-white/20 dark:accent-white"
              {...form.register("acceptTerms")}
            />
            <span>I agree to the terms required to create a workspace.</span>
          </label>
          <p className="mt-2 pl-7 text-sm text-neutral-600 dark:text-neutral-400">
            Review the{" "}
            <Link
              href="/terms"
              className="font-medium text-amber-700 underline underline-offset-4 hover:text-black dark:text-amber-300 dark:hover:text-white"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-amber-700 underline underline-offset-4 hover:text-black dark:text-amber-300 dark:hover:text-white"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        {form.formState.errors.acceptTerms ? (
          <p className="text-sm text-rose-600">
            {form.formState.errors.acceptTerms.message}
          </p>
        ) : null}
      </div>

      <div className="pt-2">
        <Button
          className="w-full justify-center"
          disabled={isPending || !acceptTerms}
          size="lg"
          type="submit"
        >
          {isPending ? "Creating account..." : "Create workspace"}
        </Button>
      </div>

      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        Already have an account?{" "}
        <button
          type="button"
          className="font-medium text-black underline underline-offset-4 hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
          onClick={onSwitch}
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
