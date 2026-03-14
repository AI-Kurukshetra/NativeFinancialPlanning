import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type SetAllCookies } from "@supabase/ssr";

import { hasSupabaseEnv, publicEnv } from "@/lib/env";

export const SESSION_REFRESH_PATHS = [
  "/analytics",
  "/budgets",
  "/currencies",
  "/dashboard",
  "/forecasts",
  "/integrations",
  "/login",
  "/modeling",
  "/notifications",
  "/reports",
  "/search",
  "/signup",
  "/templates",
  "/workbooks",
  "/workflows",
  "/workspace",
] as const;

const PROTECTED_PREFIXES = SESSION_REFRESH_PATHS.filter(
  (pathname) => pathname !== "/login" && pathname !== "/signup",
);

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (!hasSupabaseEnv) {
    return response;
  }

  const supabase = createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL!,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requiresAuth = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (requiresAuth && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
