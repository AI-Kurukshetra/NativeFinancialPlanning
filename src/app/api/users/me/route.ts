import { NextResponse } from "next/server";

import { getCurrentWorkspaceContext } from "@/lib/supabase/current-user";
import { hasSupabaseEnv } from "@/lib/env";

export async function GET() {
  if (!hasSupabaseEnv) {
    return NextResponse.json(
      {
        error:
          "Supabase environment variables are missing. Configure auth to load workspace context.",
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
