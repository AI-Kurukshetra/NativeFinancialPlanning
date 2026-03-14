import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/analytics/:path*",
    "/budgets/:path*",
    "/currencies/:path*",
    "/dashboard/:path*",
    "/forecasts/:path*",
    "/integrations/:path*",
    "/login/:path*",
    "/modeling/:path*",
    "/notifications/:path*",
    "/reports/:path*",
    "/search/:path*",
    "/signup/:path*",
    "/templates/:path*",
    "/workbooks/:path*",
    "/workflows/:path*",
    "/workspace/:path*",
  ],
};
