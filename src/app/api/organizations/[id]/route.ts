import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import {
  apiError,
  parseJsonBody,
  requireApiAccess,
  type ApiSupabaseClient,
} from "@/lib/api/route-helpers";
import { organizationUpdateSchema } from "@/lib/schemas/resources";

type OrganizationRow = {
  id: string;
  name: string;
  slug: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type MembershipRow = {
  id: string;
  role: "admin" | "editor" | "viewer" | "approver";
  is_default: boolean;
};

async function getOrganizationDetail(
  organizationId: string,
  userId: string,
  supabase: ApiSupabaseClient,
) {
  const [organizationResult, membershipResult, memberCountResult] = await Promise.all([
    supabase
      .from("organizations")
      .select("id, name, slug, created_by, created_at, updated_at")
      .eq("id", organizationId)
      .maybeSingle<OrganizationRow>(),
    supabase
      .from("organization_memberships")
      .select("id, role, is_default")
      .eq("organization_id", organizationId)
      .eq("user_id", userId)
      .maybeSingle<MembershipRow>(),
    supabase
      .from("organization_memberships")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
  ]);

  if (organizationResult.error) {
    return { response: apiError(organizationResult.error.message, 500) };
  }

  if (membershipResult.error) {
    return { response: apiError(membershipResult.error.message, 500) };
  }

  if (memberCountResult.error) {
    return { response: apiError(memberCountResult.error.message, 500) };
  }

  if (!organizationResult.data || !membershipResult.data) {
    return { response: apiError("Organization not found.", 404) };
  }

  return {
    data: {
      ...organizationResult.data,
      membership: membershipResult.data,
      memberCount: memberCountResult.count ?? 0,
    },
  };
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const { id } = await params;
  const detail = await getOrganizationDetail(id, access.workspace.user.id, access.supabase);

  if ("response" in detail) {
    return detail.response;
  }

  return NextResponse.json({ data: detail.data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  try {
    const input = organizationUpdateSchema.parse(payload);
    const { id } = await params;
    const membershipResult = await access.supabase
      .from("organization_memberships")
      .select("role")
      .eq("organization_id", id)
      .eq("user_id", access.workspace.user.id)
      .maybeSingle<{ role: "admin" | "editor" | "viewer" | "approver" }>();

    if (membershipResult.error) {
      return apiError(membershipResult.error.message, 500);
    }

    if (!membershipResult.data) {
      return apiError("Organization not found.", 404);
    }

    if ((input.name !== undefined || input.slug !== undefined) && membershipResult.data.role !== "admin") {
      return apiError("Only organization admins can update organization metadata.", 403);
    }

    if (input.name !== undefined || input.slug !== undefined) {
      const updateResult = await access.supabase
        .from("organizations")
        .update({
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.slug !== undefined ? { slug: input.slug } : {}),
        })
        .eq("id", id);

      if (updateResult.error) {
        return apiError(updateResult.error.message, 500);
      }
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

      const setDefaultResult = await access.supabase
        .from("organization_memberships")
        .update({ is_default: true })
        .eq("organization_id", id)
        .eq("user_id", access.workspace.user.id);

      if (setDefaultResult.error) {
        return apiError(setDefaultResult.error.message, 500);
      }

      const profileResult = await access.supabase
        .from("profiles")
        .update({ default_organization_id: id })
        .eq("id", access.workspace.user.id);

      if (profileResult.error) {
        return apiError(profileResult.error.message, 500);
      }
    }

    const detail = await getOrganizationDetail(id, access.workspace.user.id, access.supabase);

    if ("response" in detail) {
      return detail.response;
    }

    return NextResponse.json({ data: detail.data });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid organization payload.", 400);
    }

    return apiError("Unexpected organization update error.", 500);
  }
}
