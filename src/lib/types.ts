import type { Route } from "next";

export type WorkbookStatus = "draft" | "in_review" | "published" | "archived";
export type UserRole = "admin" | "editor" | "viewer" | "approver";

export interface NavItem {
  href: Route;
  label: string;
  description?: string;
}

export interface WorkbookSummary {
  id: string;
  name: string;
  description: string;
  status: WorkbookStatus;
  owner: string;
  updatedAt: string;
  collaborators: number;
}

export interface DashboardMetric {
  label: string;
  value: string;
  change: number;
  emphasis?: "neutral" | "positive" | "warning";
}

export interface BudgetLine {
  name: string;
  plan: number;
  actual: number;
  variance: number;
}

export interface CurrentOrganization {
  id: string;
  name: string;
  slug: string;
}

export interface CurrentProfile {
  id: string;
  email: string;
  fullName: string | null;
  defaultOrganizationId: string | null;
}

export interface CurrentMembership {
  id: string;
  organizationId: string;
  role: UserRole;
  isDefault: boolean;
}

export interface CurrentWorkspaceContext {
  user: {
    id: string;
    email: string | null;
  } | null;
  profile: CurrentProfile | null;
  membership: CurrentMembership | null;
  organization: CurrentOrganization | null;
}
