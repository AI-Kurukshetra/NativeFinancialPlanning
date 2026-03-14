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

export function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      organizationName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        toast.error("Configure Supabase environment variables to enable authentication.");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            organization_name: values.organizationName,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Check your inbox to confirm the account.");
      router.push("/login");
    });
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="fullName">
          Full name
        </label>
        <Input id="fullName" placeholder="Aarav Sharma" {...form.register("fullName")} />
        {form.formState.errors.fullName ? <p className="text-sm text-rose-600">{form.formState.errors.fullName.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="organizationName">
          Organization
        </label>
        <Input id="organizationName" placeholder="Northwind Finance" {...form.register("organizationName")} />
        {form.formState.errors.organizationName ? (
          <p className="text-sm text-rose-600">{form.formState.errors.organizationName.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="email">
          Work email
        </label>
        <Input id="email" placeholder="finance@company.com" {...form.register("email")} />
        {form.formState.errors.email ? <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="password">
          Password
        </label>
        <Input id="password" type="password" placeholder="Minimum 8 characters" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-sm text-rose-600">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Creating account..." : "Create workspace"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have access?{" "}
        <Link className="font-medium text-slate-950 underline underline-offset-4" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}

