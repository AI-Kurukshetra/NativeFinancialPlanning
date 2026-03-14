"use client";

import { createBrowserClient } from "@supabase/ssr";

import { hasSupabaseEnv, publicEnv } from "@/lib/env";

export function createSupabaseBrowserClient() {
  if (!hasSupabaseEnv) {
    return null;
  }

  return createBrowserClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL!,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

