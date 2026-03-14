export type WorkbookStatus = "draft" | "in_review" | "published" | "archived";
export type UserRole = "admin" | "editor" | "viewer" | "approver";

export interface NavItem {
  href: string;
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

