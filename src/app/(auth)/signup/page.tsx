import { redirect } from "next/navigation";

import AuthPage from "@/app/(auth)/auth-page";
import { getCurrentWorkspaceContext } from "@/lib/supabase/current-user";

export default async function SignupPage() {
  const context = await getCurrentWorkspaceContext();

  if (context.user) {
    redirect("/dashboard");
  }

  return <AuthPage mode="signup" />;
}
