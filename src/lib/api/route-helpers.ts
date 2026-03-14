import { ZodError } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceContext } from "@/lib/supabase/current-user";
import type { CurrentMembership, CurrentOrganization, UserRole } from "@/lib/types";

type ApiWorkspaceContext = {
  user: {
    id: string;
    email: string | null;
  };
  membership: CurrentMembership;
  organization: CurrentOrganization;
};

type ApiAccess =
  | {
      response: NextResponse;
    }
  | {
      supabase: SupabaseClient;
      workspace: ApiWorkspaceContext;
    };

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function parseJsonBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function validationError(error: unknown, fallbackMessage: string) {
  if (error instanceof ZodError) {
    return apiError(error.issues[0]?.message ?? fallbackMessage, 400);
  }

  return apiError(fallbackMessage, 400);
}

export function createSlug(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "workspace"
  );
}

export type ApiSupabaseClient = SupabaseClient;

export async function requireApiAccess(
  allowedRoles?: UserRole[],
): Promise<ApiAccess> {
  if (!hasSupabaseEnv) {
    return {
      response: apiError(
        "Supabase environment variables are missing. Configure auth and database access first.",
        503,
      ),
    };
  }

  const [supabase, workspace] = await Promise.all([
    createSupabaseServerClient(),
    getCurrentWorkspaceContext(),
  ]);

  if (!supabase) {
    return {
      response: apiError(
        "Supabase server client is unavailable. Check your environment configuration.",
        503,
      ),
    };
  }

  if (!workspace.user) {
    return {
      response: apiError("Unauthorized", 401),
    };
  }

  if (!workspace.membership || !workspace.organization) {
    return {
      response: apiError(
        "No active organization context was found for the current user.",
        403,
      ),
    };
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(workspace.membership.role)
  ) {
    return {
      response: apiError("Forbidden", 403),
    };
  }

  return {
    supabase,
    workspace: {
      user: workspace.user,
      membership: workspace.membership,
      organization: workspace.organization,
    },
  };
}
