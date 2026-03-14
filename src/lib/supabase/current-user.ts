import { cache } from "react";

import type {
  CurrentMembership,
  CurrentOrganization,
  CurrentProfile,
  CurrentWorkspaceContext,
} from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type MembershipRow = {
  id: string;
  organization_id: string;
  role: CurrentMembership["role"];
  is_default: boolean;
  organizations: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  default_organization_id: string | null;
};

const EMPTY_CONTEXT: CurrentWorkspaceContext = {
  user: null,
  profile: null,
  membership: null,
  organization: null,
};

export const getCurrentWorkspaceContext = cache(
  async (): Promise<CurrentWorkspaceContext> => {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return EMPTY_CONTEXT;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return EMPTY_CONTEXT;
    }

    const [{ data: profile }, { data: memberships }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, default_organization_id")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>(),
      supabase
        .from("organization_memberships")
        .select(
          "id, organization_id, role, is_default, organizations:organization_id(id, name, slug)",
        )
        .eq("user_id", user.id)
        .returns<MembershipRow[]>(),
    ]);

    const selectedMembership =
      memberships?.find(
        (membership) =>
          membership.is_default ||
          membership.organization_id === profile?.default_organization_id,
      ) ?? memberships?.[0];

    const currentProfile: CurrentProfile | null = profile
      ? {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          defaultOrganizationId: profile.default_organization_id,
        }
      : null;

    const currentMembership: CurrentMembership | null = selectedMembership
      ? {
          id: selectedMembership.id,
          organizationId: selectedMembership.organization_id,
          role: selectedMembership.role,
          isDefault: selectedMembership.is_default,
        }
      : null;

    const currentOrganization: CurrentOrganization | null =
      selectedMembership?.organizations
        ? {
            id: selectedMembership.organizations.id,
            name: selectedMembership.organizations.name,
            slug: selectedMembership.organizations.slug,
          }
        : null;

    return {
      user: {
        id: user.id,
        email: user.email ?? null,
      },
      profile: currentProfile,
      membership: currentMembership,
      organization: currentOrganization,
    };
  },
);
