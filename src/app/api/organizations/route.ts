import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import {
  apiError,
  createSlug,
  parseJsonBody,
  requireApiAccess,
} from "@/lib/api/route-helpers";
import { organizationCreateSchema } from "@/lib/schemas/resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type MembershipRow = {
  id: string;
  organization_id: string;
  role: "admin" | "editor" | "viewer" | "approver";
  is_default: boolean;
  organizations: {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
  } | null;
};

export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return apiError(
      "Supabase environment variables are missing. Configure auth and database access first.",
      503,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return apiError("Unauthorized", 401);
  }

  const membershipsResult = await supabase
    .from("organization_memberships")
    .select(
      "id, organization_id, role, is_default, organizations:organization_id(id, name, slug, created_at, updated_at)",
    )
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true })
    .returns<MembershipRow[]>();

  if (membershipsResult.error) {
    return apiError(membershipsResult.error.message, 500);
  }

  return NextResponse.json({
    data: (membershipsResult.data ?? [])
      .filter((membership) => membership.organizations)
      .map((membership) => ({
        id: membership.organizations!.id,
        name: membership.organizations!.name,
        slug: membership.organizations!.slug,
        membershipId: membership.id,
        role: membership.role,
        isDefault: membership.is_default,
        createdAt: membership.organizations!.created_at,
        updatedAt: membership.organizations!.updated_at,
      })),
  });
}

export async function POST(request: NextRequest) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = organizationCreateSchema.parse(payload);
    const slugBase = createSlug(input.slug ?? input.name);
    const slugCandidate = `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;

    const organizationResult = await access.supabase
      .from("organizations")
      .insert({
        name: input.name,
        slug: slugCandidate,
        created_by: access.workspace.user.id,
      })
      .select("id, name, slug, created_at, updated_at")
      .maybeSingle();

    if (organizationResult.error) {
      return apiError(organizationResult.error.message, 500);
    }

    if (!organizationResult.data) {
      return apiError("Organization creation returned no row.", 500);
    }

    if (input.makeDefault) {
      const resetDefaultsResult = await access.supabase
        .from("organization_memberships")
        .update({ is_default: false })
        .eq("user_id", access.workspace.user.id)
        .eq("is_default", true);

      if (resetDefaultsResult.error) {
        return apiError(resetDefaultsResult.error.message, 500);
      }
    }

    const membershipResult = await access.supabase
      .from("organization_memberships")
      .insert({
        organization_id: organizationResult.data.id,
        user_id: access.workspace.user.id,
        role: "admin",
        is_default: input.makeDefault,
      })
      .select("id, role, is_default")
      .maybeSingle();

    if (membershipResult.error) {
      return apiError(membershipResult.error.message, 500);
    }

    if (input.makeDefault) {
      const profileResult = await access.supabase
        .from("profiles")
        .update({ default_organization_id: organizationResult.data.id })
        .eq("id", access.workspace.user.id);

      if (profileResult.error) {
        return apiError(profileResult.error.message, 500);
      }
    }

    return NextResponse.json(
      {
        data: {
          ...organizationResult.data,
          membershipId: membershipResult.data?.id ?? null,
          role: membershipResult.data?.role ?? "admin",
          isDefault: membershipResult.data?.is_default ?? input.makeDefault,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid organization payload.", 400);
    }

    return apiError("Unexpected organization creation error.", 500);
  }
}
