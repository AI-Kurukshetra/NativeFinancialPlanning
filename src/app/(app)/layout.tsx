import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/shell/app-sidebar";
import { getCurrentWorkspaceContext } from "@/lib/supabase/current-user";

export default async function ProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  const context = await getCurrentWorkspaceContext();

  if (!context.user) {
    redirect("/login");
  }

  const organizationName = context.organization?.name ?? "Workspace setup";
  const userName = context.profile?.fullName ?? context.user.email ?? "Finance user";
  const userEmail = context.user.email ?? context.profile?.email ?? "No email";

  return (
    <div className="min-h-screen lg:flex">
      <AppSidebar
        organizationName={organizationName}
        userEmail={userEmail}
        userName={userName}
      />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
