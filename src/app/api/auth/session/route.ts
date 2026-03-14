import { NextResponse } from "next/server";

import { hasSupabaseEnv } from "@/lib/env";
import { getCurrentWorkspaceContext } from "@/lib/supabase/current-user";

export async function GET() {
  if (!hasSupabaseEnv) {
    return NextResponse.json(
      {
        error:
          "Supabase environment variables are missing. Configure auth to inspect the current session.",
      },
      { status: 503 },
    );
  }

  const context = await getCurrentWorkspaceContext();

  if (!context.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ data: context });
}
