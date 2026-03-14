import "server-only";

import { cache } from "react";

import type {
  CurrentWorkspaceContext,
  DashboardMetric,
  UserRole,
  WorkbookStatus,
} from "@/lib/types";
import { getCurrentWorkspaceContext } from "@/lib/supabase/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type WorkbookRow = {
  id: string;
  created_by: string;
  name: string;
  description: string;
  status: WorkbookStatus;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string;
};

type MembershipRow = {
  id: string;
  organization_id: string;
  user_id: string;
  role: UserRole;
  is_default: boolean;
  joined_at: string;
  organizations: {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
  } | null;
};

type WorkbookWorksheetRow = {
  id: string;
  workbook_id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
};

type CellRow = {
  id: string;
  worksheet_id: string;
  row_index: number;
  column_index: number;
  raw_value: string | null;
  display_value: string | null;
  formula: string | null;
  value_type: string;
  format: Record<string, unknown>;
  metadata: Record<string, unknown>;
  updated_at: string;
};

type CommentRow = {
  id: string;
  workbook_id: string | null;
  worksheet_id: string | null;
  row_index: number | null;
  column_index: number | null;
  author_id: string;
  body: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

type VersionRow = {
  id: string;
  workbook_id: string;
  label: string;
  created_by: string | null;
  created_at: string;
};

type PlanningRow = {
  id: string;
  name: string;
  status: string;
  workbook_id: string | null;
  owner_id?: string | null;
  starts_on?: string | null;
  ends_on?: string | null;
  horizon_months?: number | null;
  updated_at: string;
};

type ReportRow = {
  id: string;
  name: string;
  status: string;
  workbook_id: string | null;
  definition: Record<string, unknown>;
  generated_at: string | null;
  updated_at: string;
};

type WorkflowRow = {
  id: string;
  name: string;
  status: string;
  workbook_id: string | null;
  current_step: string | null;
  updated_at: string;
};

type WorkflowApprovalRow = {
  id: string;
  workflow_id: string;
  approver_id: string;
  status: string;
  decision_note: string | null;
  decision_at: string | null;
};

type TemplateRow = {
  id: string;
  organization_id: string | null;
  created_by: string | null;
  name: string;
  category: string;
  description: string;
  workbook_template: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type IntegrationRow = {
  id: string;
  name: string;
  source_type: string;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type NotificationRow = {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

type ScheduleRow = {
  id: string;
  report_id: string | null;
  name: string;
  cron_expression: string;
  timezone: string;
  status: string;
  next_run_at: string | null;
  last_run_at: string | null;
  updated_at: string;
};

type AuditRow = {
  id: number;
  entity_id: string;
  entity_type: string;
  action: string;
  created_at: string;
};

type CurrencyRow = {
  id: string;
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  is_base: boolean;
  updated_at: string;
};

type ExchangeRateRow = {
  id: string;
  base_currency_id: string;
  quote_currency_id: string;
  rate: number | string;
  source: string;
  effective_at: string;
  updated_at: string;
};

type ScenarioRow = {
  id: string;
  forecast_id: string | null;
  workbook_id: string | null;
  name: string;
  status: string;
  driver_summary: Record<string, unknown>;
  updated_at: string;
};

type AccountRow = {
  id: string;
  code: string;
  name: string;
  category: string;
  updated_at: string;
};

type CostCenterRow = {
  id: string;
  owner_id: string | null;
  code: string;
  name: string;
  region: string;
  updated_at: string;
};

type DimensionRow = {
  id: string;
  key: string;
  name: string;
  value_options: string[];
  updated_at: string;
};

type MetricRow = {
  id: string;
  workbook_id: string | null;
  name: string;
  slug: string;
  unit: string;
  actual_value: number | string | null;
  target_value: number | string | null;
  change_pct: number | string | null;
  updated_at: string;
};

type VarianceRow = {
  id: string;
  budget_id: string | null;
  forecast_id: string | null;
  account_id: string | null;
  cost_center_id: string | null;
  metric_id: string | null;
  name: string;
  period_label: string;
  plan_value: number | string;
  actual_value: number | string;
  variance_value: number | string;
  variance_percent: number | string | null;
  status: string;
  updated_at: string;
};

type AuthenticatedServerContext = {
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
  workspace: CurrentWorkspaceContext;
};

type WorkspaceServerContext = AuthenticatedServerContext & {
  workspace: CurrentWorkspaceContext & {
    user: NonNullable<CurrentWorkspaceContext["user"]>;
    organization: NonNullable<CurrentWorkspaceContext["organization"]>;
    membership: NonNullable<CurrentWorkspaceContext["membership"]>;
  };
};

export type WorkbookPageItem = {
  id: string;
  name: string;
  description: string;
  status: WorkbookStatus;
  owner: string;
  updatedAt: string;
  collaborators: number;
};

export type WorkbookDetailItem = WorkbookPageItem & {
  worksheets: Array<
    WorkbookWorksheetRow & {
      cells: CellRow[];
    }
  >;
  comments: CommentRow[];
  versions: VersionRow[];
};

export type BudgetPageItem = {
  id: string;
  name: string;
  status: string;
  workbookId: string | null;
  ownerId: string | null;
  startsOn: string | null;
  endsOn: string | null;
  updatedAt: string;
};

export type ForecastPageItem = {
  id: string;
  name: string;
  status: string;
  workbookId: string | null;
  ownerId: string | null;
  horizonMonths: number | null;
  updatedAt: string;
};

export type ReportPageItem = {
  id: string;
  name: string;
  status: string;
  workbookId: string | null;
  definition: Record<string, unknown>;
  generatedAt: string | null;
  updatedAt: string;
};

export type WorkflowApprovalItem = WorkflowApprovalRow & {
  approverName: string;
};

export type WorkflowPageItem = {
  id: string;
  name: string;
  status: string;
  workbookId: string | null;
  currentStep: string | null;
  approvals: WorkflowApprovalItem[];
  updatedAt: string;
};

export type ApproverChoice = {
  id: string;
  name: string;
  role: UserRole;
};

export type WorkspacePageItem = {
  id: string;
  name: string;
  slug: string;
  role: UserRole;
  isCurrent: boolean;
  isDefault: boolean;
  memberCount: number;
  joinedAt: string;
  updatedAt: string;
};

export type TemplatePageItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  scope: "global" | "organization";
  updatedAt: string;
};

export type IntegrationPageItem = {
  id: string;
  name: string;
  sourceType: string;
  config: Record<string, unknown>;
  updatedAt: string;
};

export type NotificationPageItem = {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  metadata: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SchedulePageItem = {
  id: string;
  reportId: string | null;
  reportName: string | null;
  name: string;
  cronExpression: string;
  timezone: string;
  status: string;
  nextRunAt: string | null;
  lastRunAt: string | null;
  updatedAt: string;
};

export type DashboardPageData = {
  context: CurrentWorkspaceContext;
  metrics: DashboardMetric[];
  workbooks: WorkbookPageItem[];
  pendingApprovals: number;
  openComments: number;
  unreadNotifications: number;
  planningCounts: {
    budgets: number;
    forecasts: number;
    reports: number;
    workflows: number;
    versions: number;
  };
  workbookStatusBreakdown: Record<WorkbookStatus, number>;
  reportStatusBreakdown: Record<string, number>;
  workflowStatusBreakdown: Record<string, number>;
  recentAuditEvents: Array<{
    id: number;
    action: string;
    entityType: string;
    createdAt: string;
  }>;
  scenarioSummary: {
    total: number;
    active: number;
    linkedForecasts: number;
  };
  modelCoverage: {
    accounts: number;
    costCenters: number;
    dimensions: number;
    exchangeRates: number;
  };
  metricHighlights: Array<{
    id: string;
    name: string;
    unit: string;
    actualValue: number | null;
    targetValue: number | null;
    changePct: number | null;
  }>;
  varianceHighlights: Array<{
    id: string;
    name: string;
    periodLabel: string;
    varianceValue: number;
    variancePercent: number | null;
    status: string;
  }>;
  latestNotifications: NotificationPageItem[];
};

export type CurrencyPageItem = {
  id: string;
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  isBase: boolean;
  updatedAt: string;
};

export type ExchangeRatePageItem = {
  id: string;
  baseCurrencyId: string;
  baseCurrencyCode: string;
  quoteCurrencyId: string;
  quoteCurrencyCode: string;
  rate: number;
  source: string;
  effectiveAt: string;
  updatedAt: string;
};

export type ScenarioPageItem = {
  id: string;
  name: string;
  status: string;
  workbookId: string | null;
  workbookName: string | null;
  forecastId: string | null;
  forecastName: string | null;
  drivers: Array<{ key: string; value: string }>;
  updatedAt: string;
};

export type MetricPageItem = {
  id: string;
  name: string;
  unit: string;
  actualValue: number | null;
  targetValue: number | null;
  changePct: number | null;
  workbookName: string | null;
  updatedAt: string;
};

export type VariancePageItem = {
  id: string;
  name: string;
  periodLabel: string;
  planValue: number;
  actualValue: number;
  varianceValue: number;
  variancePercent: number | null;
  status: string;
  accountName: string | null;
  costCenterName: string | null;
  updatedAt: string;
};

export type AnalyticsPageData = {
  context: CurrentWorkspaceContext;
  metrics: MetricPageItem[];
  variances: VariancePageItem[];
  scenarios: ScenarioPageItem[];
  summary: {
    accounts: number;
    costCenters: number;
    dimensions: number;
    metrics: number;
    variances: number;
    scenarios: number;
  };
  dimensionCoverage: Array<{
    id: string;
    name: string;
    key: string;
    valuesCount: number;
    updatedAt: string;
  }>;
};

export type ModelingPageData = {
  accounts: Array<{
    id: string;
    code: string;
    name: string;
    category: string;
    updatedAt: string;
  }>;
  costCenters: Array<{
    id: string;
    code: string;
    name: string;
    region: string;
    owner: string;
    updatedAt: string;
  }>;
  dimensions: Array<{
    id: string;
    key: string;
    name: string;
    values: string[];
    updatedAt: string;
  }>;
  scenarios: ScenarioPageItem[];
  metrics: MetricPageItem[];
  variances: VariancePageItem[];
};

export type CurrenciesPageData = {
  baseCurrencyCode: string | null;
  currencies: CurrencyPageItem[];
  exchangeRates: ExchangeRatePageItem[];
};

export type SearchResultItem = {
  id: string;
  type: "workbook" | "report" | "workflow" | "template" | "integration";
  title: string;
  description: string;
  href: string;
  metadata: string;
};

export type SearchPageData = {
  query: string;
  results: SearchResultItem[];
};

const EMPTY_RESULT = {
  context: {
    user: null,
    profile: null,
    membership: null,
    organization: null,
  } satisfies CurrentWorkspaceContext,
};

function countStatuses<T extends string>(values: string[], statuses: readonly T[]) {
  return statuses.reduce(
    (accumulator, status) => ({
      ...accumulator,
      [status]: values.filter((value) => value === status).length,
    }),
    {} as Record<T, number>,
  );
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

const getAuthenticatedServerContext = cache(
  async (): Promise<AuthenticatedServerContext | null> => {
    const [supabase, workspace] = await Promise.all([
      createSupabaseServerClient(),
      getCurrentWorkspaceContext(),
    ]);

    if (!supabase || !workspace.user) {
      return null;
    }

    return { supabase, workspace };
  },
);

const getWorkspaceServerContext = cache(
  async (): Promise<WorkspaceServerContext | null> => {
    const serverContext = await getAuthenticatedServerContext();

    if (
      !serverContext ||
      !serverContext.workspace.organization ||
      !serverContext.workspace.membership
    ) {
      return null;
    }

    return serverContext as WorkspaceServerContext;
  },
);

async function getOwnerMap(supabase: WorkspaceServerContext["supabase"]) {
  const result = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .returns<ProfileRow[]>();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return new Map(
    (result.data ?? []).map((profile) => [
      profile.id,
      profile.full_name?.trim() || profile.email,
    ]),
  );
}

async function getWorkbookNameMap(supabase: WorkspaceServerContext["supabase"], organizationId: string) {
  const result = await supabase
    .from("workbooks")
    .select("id, name")
    .eq("organization_id", organizationId)
    .returns<Array<{ id: string; name: string }>>();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return new Map((result.data ?? []).map((workbook) => [workbook.id, workbook.name]));
}

async function getForecastNameMap(
  supabase: WorkspaceServerContext["supabase"],
  organizationId: string,
) {
  const result = await supabase
    .from("forecasts")
    .select("id, name")
    .eq("organization_id", organizationId)
    .returns<Array<{ id: string; name: string }>>();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return new Map((result.data ?? []).map((forecast) => [forecast.id, forecast.name]));
}

async function getAccountNameMap(
  supabase: WorkspaceServerContext["supabase"],
  organizationId: string,
) {
  const result = await supabase
    .from("accounts")
    .select("id, name")
    .eq("organization_id", organizationId)
    .returns<Array<{ id: string; name: string }>>();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return new Map((result.data ?? []).map((account) => [account.id, account.name]));
}

async function getCostCenterNameMap(
  supabase: WorkspaceServerContext["supabase"],
  organizationId: string,
) {
  const result = await supabase
    .from("cost_centers")
    .select("id, name")
    .eq("organization_id", organizationId)
    .returns<Array<{ id: string; name: string }>>();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return new Map((result.data ?? []).map((costCenter) => [costCenter.id, costCenter.name]));
}

async function getCollaboratorCount(
  supabase: WorkspaceServerContext["supabase"],
  organizationId: string,
) {
  const result = await supabase
    .from("organization_memberships")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.count ?? 0;
}

async function getApproverChoices() {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return [] as ApproverChoice[];
  }

  const [membershipResult, owners] = await Promise.all([
    serverContext.supabase
      .from("organization_memberships")
      .select("user_id, role")
      .eq("organization_id", serverContext.workspace.organization.id)
      .returns<Array<{ user_id: string; role: UserRole }>>(),
    getOwnerMap(serverContext.supabase),
  ]);

  if (membershipResult.error) {
    throw new Error(membershipResult.error.message);
  }

  return (membershipResult.data ?? []).map((member) => ({
    id: member.user_id,
    name: owners.get(member.user_id) ?? "Unknown member",
    role: member.role,
  }));
}

export const getWorkbookPageItems = cache(async (): Promise<WorkbookPageItem[]> => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return [];
  }

  const { supabase, workspace } = serverContext;
  const [workbooksResult, owners, collaborators] = await Promise.all([
    supabase
      .from("workbooks")
      .select("id, created_by, name, description, status, updated_at")
      .eq("organization_id", workspace.organization.id)
      .order("updated_at", { ascending: false })
      .returns<WorkbookRow[]>(),
    getOwnerMap(supabase),
    getCollaboratorCount(supabase, workspace.organization.id),
  ]);

  if (workbooksResult.error) {
    throw new Error(workbooksResult.error.message);
  }

  return (workbooksResult.data ?? []).map((workbook) => ({
    id: workbook.id,
    name: workbook.name,
    description: workbook.description,
    status: workbook.status,
    owner: owners.get(workbook.created_by) ?? "Unknown",
    updatedAt: workbook.updated_at,
    collaborators,
  }));
});

export const getWorkbookDetailItem = cache(
  async (id: string): Promise<WorkbookDetailItem | null> => {
    const serverContext = await getWorkspaceServerContext();

    if (!serverContext) {
      return null;
    }

    const { supabase, workspace } = serverContext;
    const [workbookResult, worksheetsResult, commentsResult, versionsResult, owners, collaborators] =
      await Promise.all([
        supabase
          .from("workbooks")
          .select("id, created_by, name, description, status, updated_at")
          .eq("id", id)
          .eq("organization_id", workspace.organization.id)
          .maybeSingle<WorkbookRow>(),
        supabase
          .from("worksheets")
          .select("id, workbook_id, name, position, created_at, updated_at")
          .eq("workbook_id", id)
          .order("position", { ascending: true })
          .returns<WorkbookWorksheetRow[]>(),
        supabase
          .from("comments")
          .select("id, workbook_id, worksheet_id, row_index, column_index, author_id, body, resolved_at, created_at, updated_at")
          .eq("organization_id", workspace.organization.id)
          .eq("workbook_id", id)
          .order("updated_at", { ascending: false })
          .returns<CommentRow[]>(),
        supabase
          .from("versions")
          .select("id, workbook_id, label, created_by, created_at")
          .eq("organization_id", workspace.organization.id)
          .eq("workbook_id", id)
          .order("created_at", { ascending: false })
          .returns<VersionRow[]>(),
        getOwnerMap(supabase),
        getCollaboratorCount(supabase, workspace.organization.id),
      ]);

    if (workbookResult.error) {
      throw new Error(workbookResult.error.message);
    }

    if (!workbookResult.data) {
      return null;
    }

    if (worksheetsResult.error) {
      throw new Error(worksheetsResult.error.message);
    }

    if (commentsResult.error) {
      throw new Error(commentsResult.error.message);
    }

    if (versionsResult.error) {
      throw new Error(versionsResult.error.message);
    }

    const worksheetIds = (worksheetsResult.data ?? []).map((worksheet) => worksheet.id);
    const cellsResult =
      worksheetIds.length === 0
        ? { data: [] as CellRow[], error: null }
        : await supabase
            .from("cell_data")
            .select(
              "id, worksheet_id, row_index, column_index, raw_value, display_value, formula, value_type, format, metadata, updated_at",
            )
            .in("worksheet_id", worksheetIds)
            .order("row_index", { ascending: true })
            .order("column_index", { ascending: true })
            .returns<CellRow[]>();

    if (cellsResult.error) {
      throw new Error(cellsResult.error.message);
    }

    const cellsByWorksheet = new Map<string, CellRow[]>();

    for (const cell of cellsResult.data ?? []) {
      const existing = cellsByWorksheet.get(cell.worksheet_id);

      if (existing) {
        existing.push(cell);
      } else {
        cellsByWorksheet.set(cell.worksheet_id, [cell]);
      }
    }

    return {
      id: workbookResult.data.id,
      name: workbookResult.data.name,
      description: workbookResult.data.description,
      status: workbookResult.data.status,
      owner: owners.get(workbookResult.data.created_by) ?? "Unknown",
      updatedAt: workbookResult.data.updated_at,
      collaborators,
      worksheets: (worksheetsResult.data ?? []).map((worksheet) => ({
        ...worksheet,
        cells: cellsByWorksheet.get(worksheet.id) ?? [],
      })),
      comments: commentsResult.data ?? [],
      versions: versionsResult.data ?? [],
    };
  },
);

export const getDashboardPageData = cache(async (): Promise<DashboardPageData> => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return {
      context: EMPTY_RESULT.context,
      metrics: [],
      workbooks: [],
      pendingApprovals: 0,
      openComments: 0,
      unreadNotifications: 0,
      planningCounts: {
        budgets: 0,
        forecasts: 0,
        reports: 0,
        workflows: 0,
        versions: 0,
      },
      workbookStatusBreakdown: {
        draft: 0,
        in_review: 0,
        published: 0,
        archived: 0,
      },
      reportStatusBreakdown: {
        draft: 0,
        generated: 0,
        published: 0,
        archived: 0,
      },
      workflowStatusBreakdown: {
        draft: 0,
        pending_approval: 0,
        approved: 0,
        rejected: 0,
      },
      recentAuditEvents: [],
      scenarioSummary: {
        total: 0,
        active: 0,
        linkedForecasts: 0,
      },
      modelCoverage: {
        accounts: 0,
        costCenters: 0,
        dimensions: 0,
        exchangeRates: 0,
      },
      metricHighlights: [],
      varianceHighlights: [],
      latestNotifications: [],
    };
  }

  const { supabase, workspace } = serverContext;
  const organizationId = workspace.organization.id;
  const workbooks = await getWorkbookPageItems();
  const [
    budgetsCount,
    forecastsCount,
    reportsResult,
    versionsCount,
    commentsCount,
    workflowsResult,
    auditLogsResult,
    notificationsCount,
    notificationsPreview,
    trackedMetricsResult,
    varianceResult,
    scenariosResult,
    accountsCount,
    costCentersCount,
    dimensionsCount,
    exchangeRatesCount,
  ] = await Promise.all([
    supabase
      .from("budgets")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("forecasts")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("reports")
      .select("status")
      .eq("organization_id", organizationId)
      .returns<Array<{ status: string }>>(),
    supabase
      .from("versions")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .is("resolved_at", null),
    supabase
      .from("workflows")
      .select("id, status")
      .eq("organization_id", organizationId)
      .returns<Array<{ id: string; status: string }>>(),
    supabase
      .from("audit_logs")
      .select("id, entity_id, entity_type, action, created_at")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(8)
      .returns<AuditRow[]>(),
    supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("user_id", workspace.user.id)
      .is("read_at", null),
    supabase
      .from("notifications")
      .select("id, kind, title, body, link, metadata, read_at, created_at, updated_at")
      .eq("organization_id", organizationId)
      .eq("user_id", workspace.user.id)
      .order("created_at", { ascending: false })
      .limit(4)
      .returns<NotificationRow[]>(),
    supabase
      .from("metrics")
      .select("id, workbook_id, name, slug, unit, actual_value, target_value, change_pct, updated_at")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .limit(4)
      .returns<MetricRow[]>(),
    supabase
      .from("variances")
      .select("id, budget_id, forecast_id, account_id, cost_center_id, metric_id, name, period_label, plan_value, actual_value, variance_value, variance_percent, status, updated_at")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .limit(4)
      .returns<VarianceRow[]>(),
    supabase
      .from("scenarios")
      .select("id, forecast_id, workbook_id, name, status, driver_summary, updated_at")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<ScenarioRow[]>(),
    supabase
      .from("accounts")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("cost_centers")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("dimensions")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
    supabase
      .from("exchange_rates")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
  ]);

  const workflowIds = (workflowsResult.data ?? []).map((workflow) => workflow.id);
  const approvalsResult =
    workflowIds.length === 0
      ? { data: [] as Array<{ status: string }>, error: null }
      : await supabase
          .from("approvals")
          .select("status")
          .in("workflow_id", workflowIds)
          .returns<Array<{ status: string }>>();

  const error = [
    budgetsCount,
    forecastsCount,
    reportsResult,
    versionsCount,
    commentsCount,
    workflowsResult,
    auditLogsResult,
    notificationsCount,
    notificationsPreview,
    trackedMetricsResult,
    varianceResult,
    scenariosResult,
    accountsCount,
    costCentersCount,
    dimensionsCount,
    exchangeRatesCount,
    approvalsResult,
  ].find((result) => result.error);

  if (error?.error) {
    throw new Error(error.error.message);
  }

  const reportStatuses = (reportsResult.data ?? []).map((report) => report.status);
  const workflowStatuses = (workflowsResult.data ?? []).map((workflow) => workflow.status);
  const pendingApprovals = (approvalsResult.data ?? []).filter(
    (approval) => approval.status === "pending",
  ).length;
  const unreadNotifications = notificationsCount.count ?? 0;
  const scenarioItems = scenariosResult.data ?? [];

  const metrics: DashboardMetric[] = [
    {
      label: "Active Workbooks",
      value: String(workbooks.length).padStart(2, "0"),
      change: workbooks.length === 0 ? 0 : Math.min(workbooks.length * 4, 25),
      emphasis: workbooks.length > 0 ? "positive" : "neutral",
    },
    {
      label: "Metrics Tracked",
      value: String((trackedMetricsResult.data ?? []).length).padStart(2, "0"),
      change:
        (trackedMetricsResult.data ?? []).filter(
          (metric) => (toNumber(metric.change_pct) ?? 0) >= 0,
        ).length * 4,
      emphasis: "positive",
    },
    {
      label: "Scenario Sets",
      value: String(scenarioItems.length).padStart(2, "0"),
      change:
        scenarioItems.filter((scenario) => scenario.status === "active").length > 0
          ? Math.min(scenarioItems.length * 4, 20)
          : 0,
      emphasis: "neutral",
    },
    {
      label: "Action Items",
      value: String(
        pendingApprovals + (commentsCount.count ?? 0) + unreadNotifications,
      ).padStart(2, "0"),
      change:
        pendingApprovals + unreadNotifications > 0
          ? Math.min((pendingApprovals + unreadNotifications) * 3, 24)
          : 0,
      emphasis:
        pendingApprovals + unreadNotifications > 0 || (commentsCount.count ?? 0) > 0
          ? "warning"
          : "neutral",
    },
  ];

  return {
    context: workspace,
    metrics,
    workbooks: workbooks.slice(0, 5),
    pendingApprovals,
    openComments: commentsCount.count ?? 0,
    unreadNotifications,
    planningCounts: {
      budgets: budgetsCount.count ?? 0,
      forecasts: forecastsCount.count ?? 0,
      reports: reportStatuses.length,
      workflows: workflowStatuses.length,
      versions: versionsCount.count ?? 0,
    },
    workbookStatusBreakdown: countStatuses(
      workbooks.map((workbook) => workbook.status),
      ["draft", "in_review", "published", "archived"] as const,
    ),
    reportStatusBreakdown: countStatuses(
      reportStatuses,
      ["draft", "generated", "published", "archived"] as const,
    ),
    workflowStatusBreakdown: countStatuses(
      workflowStatuses,
      ["draft", "pending_approval", "approved", "rejected"] as const,
    ),
    recentAuditEvents: (auditLogsResult.data ?? []).map((event) => ({
      id: event.id,
      action: event.action,
      entityType: event.entity_type,
      createdAt: event.created_at,
    })),
    scenarioSummary: {
      total: scenarioItems.length,
      active: scenarioItems.filter((scenario) => scenario.status === "active").length,
      linkedForecasts: new Set(
        scenarioItems.flatMap((scenario) => (scenario.forecast_id ? [scenario.forecast_id] : [])),
      ).size,
    },
    modelCoverage: {
      accounts: accountsCount.count ?? 0,
      costCenters: costCentersCount.count ?? 0,
      dimensions: dimensionsCount.count ?? 0,
      exchangeRates: exchangeRatesCount.count ?? 0,
    },
    metricHighlights: (trackedMetricsResult.data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      actualValue: toNumber(item.actual_value),
      targetValue: toNumber(item.target_value),
      changePct: toNumber(item.change_pct),
    })),
    varianceHighlights: (varianceResult.data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      periodLabel: item.period_label,
      varianceValue: toNumber(item.variance_value) ?? 0,
      variancePercent: toNumber(item.variance_percent),
      status: item.status,
    })),
    latestNotifications: (notificationsPreview.data ?? []).map((item) => ({
      id: item.id,
      kind: item.kind,
      title: item.title,
      body: item.body,
      link: item.link,
      metadata: item.metadata,
      readAt: item.read_at,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })),
  };
});

async function getWorkbookChoices() {
  const workbooks = await getWorkbookPageItems();

  return workbooks.map((workbook) => ({
    id: workbook.id,
    name: workbook.name,
  }));
}

export const getBudgetsPageData = cache(async () => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return { items: [] as BudgetPageItem[], workbooks: [] as Array<{ id: string; name: string }> };
  }

  const { supabase, workspace } = serverContext;
  const [result, workbooks] = await Promise.all([
    supabase
      .from("budgets")
      .select("id, name, status, workbook_id, owner_id, starts_on, ends_on, updated_at")
      .eq("organization_id", workspace.organization.id)
      .order("updated_at", { ascending: false })
      .returns<PlanningRow[]>(),
    getWorkbookChoices(),
  ]);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return {
    items: (result.data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      status: item.status,
      workbookId: item.workbook_id ?? null,
      ownerId: item.owner_id ?? null,
      startsOn: item.starts_on ?? null,
      endsOn: item.ends_on ?? null,
      updatedAt: item.updated_at,
    })),
    workbooks,
  };
});

export const getForecastsPageData = cache(async () => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return { items: [] as ForecastPageItem[], workbooks: [] as Array<{ id: string; name: string }> };
  }

  const { supabase, workspace } = serverContext;
  const [result, workbooks] = await Promise.all([
    supabase
      .from("forecasts")
      .select("id, name, status, workbook_id, owner_id, horizon_months, updated_at")
      .eq("organization_id", workspace.organization.id)
      .order("updated_at", { ascending: false })
      .returns<PlanningRow[]>(),
    getWorkbookChoices(),
  ]);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return {
    items: (result.data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      status: item.status,
      workbookId: item.workbook_id ?? null,
      ownerId: item.owner_id ?? null,
      horizonMonths: item.horizon_months ?? null,
      updatedAt: item.updated_at,
    })),
    workbooks,
  };
});

export const getReportsPageData = cache(async () => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return {
      items: [] as ReportPageItem[],
      workbooks: [] as Array<{ id: string; name: string }>,
      schedules: [] as SchedulePageItem[],
    };
  }

  const { supabase, workspace } = serverContext;
  const [reportsResult, schedulesResult, workbooks] = await Promise.all([
    supabase
      .from("reports")
      .select("id, name, status, workbook_id, definition, generated_at, updated_at")
      .eq("organization_id", workspace.organization.id)
      .order("updated_at", { ascending: false })
      .returns<ReportRow[]>(),
    supabase
      .from("schedules")
      .select("id, report_id, name, cron_expression, timezone, status, next_run_at, last_run_at, updated_at")
      .eq("organization_id", workspace.organization.id)
      .order("updated_at", { ascending: false })
      .returns<ScheduleRow[]>(),
    getWorkbookChoices(),
  ]);

  if (reportsResult.error) {
    throw new Error(reportsResult.error.message);
  }

  if (schedulesResult.error) {
    throw new Error(schedulesResult.error.message);
  }

  const reportNameMap = new Map(
    (reportsResult.data ?? []).map((report) => [report.id, report.name]),
  );

  return {
    items: (reportsResult.data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      status: item.status,
      workbookId: item.workbook_id ?? null,
      definition: item.definition ?? {},
      generatedAt: item.generated_at ?? null,
      updatedAt: item.updated_at,
    })),
    workbooks,
    schedules: (schedulesResult.data ?? []).map((schedule) => ({
      id: schedule.id,
      reportId: schedule.report_id ?? null,
      reportName: schedule.report_id ? reportNameMap.get(schedule.report_id) ?? null : null,
      name: schedule.name,
      cronExpression: schedule.cron_expression,
      timezone: schedule.timezone,
      status: schedule.status,
      nextRunAt: schedule.next_run_at ?? null,
      lastRunAt: schedule.last_run_at ?? null,
      updatedAt: schedule.updated_at,
    })),
  };
});

export const getWorkflowsPageData = cache(async () => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return {
      items: [] as WorkflowPageItem[],
      workbooks: [] as Array<{ id: string; name: string }>,
      currentUserId: null as string | null,
      approverChoices: [] as ApproverChoice[],
    };
  }

  const { supabase, workspace } = serverContext;
  const [workflowResult, approvalsResult, workbooks, owners, approverChoices] = await Promise.all([
    supabase
      .from("workflows")
      .select("id, name, status, workbook_id, current_step, updated_at")
      .eq("organization_id", workspace.organization.id)
      .order("updated_at", { ascending: false })
      .returns<WorkflowRow[]>(),
    supabase
      .from("approvals")
      .select("id, workflow_id, approver_id, status, decision_note, decision_at")
      .returns<WorkflowApprovalRow[]>(),
    getWorkbookChoices(),
    getOwnerMap(supabase),
    getApproverChoices(),
  ]);

  if (workflowResult.error) {
    throw new Error(workflowResult.error.message);
  }

  if (approvalsResult.error) {
    throw new Error(approvalsResult.error.message);
  }

  const workflowIds = new Set((workflowResult.data ?? []).map((workflow) => workflow.id));
  const approvalsByWorkflow = new Map<string, WorkflowApprovalItem[]>();

  for (const approval of approvalsResult.data ?? []) {
    if (!workflowIds.has(approval.workflow_id)) {
      continue;
    }

    const approvalItem: WorkflowApprovalItem = {
      ...approval,
      approverName: owners.get(approval.approver_id) ?? "Unknown approver",
    };
    const existing = approvalsByWorkflow.get(approval.workflow_id);

    if (existing) {
      existing.push(approvalItem);
    } else {
      approvalsByWorkflow.set(approval.workflow_id, [approvalItem]);
    }
  }

  return {
    items: (workflowResult.data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      status: item.status,
      workbookId: item.workbook_id ?? null,
      currentStep: item.current_step ?? null,
      approvals: approvalsByWorkflow.get(item.id) ?? [],
      updatedAt: item.updated_at,
    })),
    workbooks,
    currentUserId: workspace.user.id,
    approverChoices,
  };
});

export const getWorkspacePageData = cache(async () => {
  const serverContext = await getAuthenticatedServerContext();

  if (!serverContext) {
    return {
      context: EMPTY_RESULT.context,
      items: [] as WorkspacePageItem[],
    };
  }

  const { supabase, workspace } = serverContext;
  const membershipResult = await supabase
    .from("organization_memberships")
    .select(
      "id, organization_id, user_id, role, is_default, joined_at, organizations:organization_id(id, name, slug, created_at, updated_at)",
    )
    .eq("user_id", workspace.user!.id)
    .order("joined_at", { ascending: true })
    .returns<MembershipRow[]>();

  if (membershipResult.error) {
    throw new Error(membershipResult.error.message);
  }

  const organizationIds = (membershipResult.data ?? []).map((membership) => membership.organization_id);
  const memberCountsResult =
    organizationIds.length === 0
      ? { data: [] as Array<{ organization_id: string }>, error: null }
      : await supabase
          .from("organization_memberships")
          .select("organization_id")
          .in("organization_id", organizationIds)
          .returns<Array<{ organization_id: string }>>();

  if (memberCountsResult.error) {
    throw new Error(memberCountsResult.error.message);
  }

  const memberCounts = new Map<string, number>();

  for (const membership of memberCountsResult.data ?? []) {
    memberCounts.set(
      membership.organization_id,
      (memberCounts.get(membership.organization_id) ?? 0) + 1,
    );
  }

  return {
    context: workspace,
    items: (membershipResult.data ?? [])
      .filter((membership) => membership.organizations)
      .map((membership) => ({
        id: membership.organizations!.id,
        name: membership.organizations!.name,
        slug: membership.organizations!.slug,
        role: membership.role,
        isCurrent: membership.organization_id === workspace.organization?.id,
        isDefault: membership.is_default,
        memberCount: memberCounts.get(membership.organization_id) ?? 1,
        joinedAt: membership.joined_at,
        updatedAt: membership.organizations!.updated_at,
      })),
  };
});

export const getTemplatesPageData = cache(
  async (): Promise<{ items: TemplatePageItem[] }> => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return { items: [] as TemplatePageItem[] };
  }

  const result = await serverContext.supabase
    .from("templates")
    .select("id, organization_id, created_by, name, category, description, workbook_template, created_at, updated_at")
    .or(`organization_id.is.null,organization_id.eq.${serverContext.workspace.organization.id}`)
    .order("updated_at", { ascending: false })
    .returns<TemplateRow[]>();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return {
    items: (result.data ?? []).map((template) => ({
      id: template.id,
      name: template.name,
      category: template.category,
      description: template.description,
      scope: template.organization_id ? ("organization" as const) : ("global" as const),
      updatedAt: template.updated_at,
    })),
  };
  },
);

export const getIntegrationsPageData = cache(async () => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return { items: [] as IntegrationPageItem[] };
  }

  const result = await serverContext.supabase
    .from("data_sources")
    .select("id, name, source_type, config, created_at, updated_at")
    .eq("organization_id", serverContext.workspace.organization.id)
    .order("updated_at", { ascending: false })
    .returns<IntegrationRow[]>();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return {
    items: (result.data ?? []).map((source) => ({
      id: source.id,
      name: source.name,
      sourceType: source.source_type,
      config: source.config,
      updatedAt: source.updated_at,
    })),
  };
});

export const getNotificationsPageData = cache(async () => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return {
      items: [] as NotificationPageItem[],
      unreadCount: 0,
    };
  }

  const result = await serverContext.supabase
    .from("notifications")
    .select("id, kind, title, body, link, metadata, read_at, created_at, updated_at")
    .eq("organization_id", serverContext.workspace.organization.id)
    .eq("user_id", serverContext.workspace.user.id)
    .order("created_at", { ascending: false })
    .returns<NotificationRow[]>();

  if (result.error) {
    throw new Error(result.error.message);
  }

  const items = (result.data ?? []).map((notification) => ({
    id: notification.id,
    kind: notification.kind,
    title: notification.title,
    body: notification.body,
    link: notification.link,
    metadata: notification.metadata,
    readAt: notification.read_at,
    createdAt: notification.created_at,
    updatedAt: notification.updated_at,
  }));

  return {
    items,
    unreadCount: items.filter((notification) => !notification.readAt).length,
  };
});

export const getSearchPageData = cache(async (query: string): Promise<SearchPageData> => {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length === 0) {
    return {
      query: "",
      results: [],
    };
  }

  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return {
      query: trimmedQuery,
      results: [],
    };
  }

  const { supabase, workspace } = serverContext;
  const organizationId = workspace.organization.id;
  const searchPattern = `%${trimmedQuery}%`;
  const [owners, workbooksResult, reportsResult, workflowsResult, templatesResult, integrationsResult] =
    await Promise.all([
      getOwnerMap(supabase),
      supabase
        .from("workbooks")
        .select("id, created_by, name, description, status, updated_at")
        .eq("organization_id", organizationId)
        .or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .order("updated_at", { ascending: false })
        .limit(8)
        .returns<WorkbookRow[]>(),
      supabase
        .from("reports")
        .select("id, name, status, workbook_id, definition, generated_at, updated_at")
        .eq("organization_id", organizationId)
        .ilike("name", searchPattern)
        .order("updated_at", { ascending: false })
        .limit(8)
        .returns<ReportRow[]>(),
      supabase
        .from("workflows")
        .select("id, name, status, workbook_id, current_step, updated_at")
        .eq("organization_id", organizationId)
        .or(`name.ilike.${searchPattern},current_step.ilike.${searchPattern}`)
        .order("updated_at", { ascending: false })
        .limit(8)
        .returns<WorkflowRow[]>(),
      supabase
        .from("templates")
        .select("id, organization_id, created_by, name, category, description, workbook_template, created_at, updated_at")
        .or(`organization_id.is.null,organization_id.eq.${organizationId}`)
        .order("updated_at", { ascending: false })
        .limit(20)
        .returns<TemplateRow[]>(),
      supabase
        .from("data_sources")
        .select("id, name, source_type, config, created_at, updated_at")
        .eq("organization_id", organizationId)
        .order("updated_at", { ascending: false })
        .limit(20)
        .returns<IntegrationRow[]>(),
    ]);

  const error = [
    workbooksResult,
    reportsResult,
    workflowsResult,
    templatesResult,
    integrationsResult,
  ].find((result) => result.error);

  if (error?.error) {
    throw new Error(error.error.message);
  }

  return {
    query: trimmedQuery,
    results: [
      ...(workbooksResult.data ?? []).map((item) => ({
        id: item.id,
        type: "workbook" as const,
        title: item.name,
        description: item.description,
        href: `/workbooks/${item.id}`,
        metadata: `${item.status.replaceAll("_", " ")} · ${owners.get(item.created_by) ?? "Unknown owner"}`,
      })),
      ...(reportsResult.data ?? []).map((item) => ({
        id: item.id,
        type: "report" as const,
        title: item.name,
        description: `Layout ${(item.definition.layout as string | undefined) ?? "custom"}`,
        href: `/reports`,
        metadata: item.status.replaceAll("_", " "),
      })),
      ...(workflowsResult.data ?? []).map((item) => ({
        id: item.id,
        type: "workflow" as const,
        title: item.name,
        description: item.current_step ?? "No current review step",
        href: `/workflows`,
        metadata: item.status.replaceAll("_", " "),
      })),
      ...(templatesResult.data ?? [])
        .filter((item) =>
          [item.name, item.description, item.category]
            .join(" ")
            .toLowerCase()
            .includes(trimmedQuery.toLowerCase()),
        )
        .map((item) => ({
        id: item.id,
        type: "template" as const,
        title: item.name,
        description: item.description,
        href: `/templates`,
        metadata: `${item.category} · ${item.organization_id ? "workspace" : "global"}`,
      })),
      ...(integrationsResult.data ?? [])
        .filter((item) =>
          [item.name, item.source_type]
            .join(" ")
            .toLowerCase()
            .includes(trimmedQuery.toLowerCase()),
        )
        .map((item) => ({
        id: item.id,
        type: "integration" as const,
        title: item.name,
        description: item.source_type,
        href: `/integrations`,
        metadata: "data source",
      })),
    ],
  };
});

export const getCurrenciesPageData = cache(async (): Promise<CurrenciesPageData> => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return {
      baseCurrencyCode: null,
      currencies: [],
      exchangeRates: [],
    };
  }

  const { supabase, workspace } = serverContext;
  const [currenciesResult, exchangeRatesResult] = await Promise.all([
    supabase
      .from("currencies")
      .select("id, code, name, symbol, decimal_places, is_base, updated_at")
      .eq("organization_id", workspace.organization.id)
      .order("is_base", { ascending: false })
      .order("code", { ascending: true })
      .returns<CurrencyRow[]>(),
    supabase
      .from("exchange_rates")
      .select("id, base_currency_id, quote_currency_id, rate, source, effective_at, updated_at")
      .eq("organization_id", workspace.organization.id)
      .order("effective_at", { ascending: false })
      .returns<ExchangeRateRow[]>(),
  ]);

  if (currenciesResult.error) {
    throw new Error(currenciesResult.error.message);
  }

  if (exchangeRatesResult.error) {
    throw new Error(exchangeRatesResult.error.message);
  }

  const codeMap = new Map(
    (currenciesResult.data ?? []).map((currency) => [currency.id, currency.code]),
  );
  const currencies = (currenciesResult.data ?? []).map((currency) => ({
    id: currency.id,
    code: currency.code,
    name: currency.name,
    symbol: currency.symbol,
    decimalPlaces: currency.decimal_places,
    isBase: currency.is_base,
    updatedAt: currency.updated_at,
  }));

  return {
    baseCurrencyCode: currencies.find((currency) => currency.isBase)?.code ?? null,
    currencies,
    exchangeRates: (exchangeRatesResult.data ?? []).map((rate) => ({
      id: rate.id,
      baseCurrencyId: rate.base_currency_id,
      baseCurrencyCode: codeMap.get(rate.base_currency_id) ?? "N/A",
      quoteCurrencyId: rate.quote_currency_id,
      quoteCurrencyCode: codeMap.get(rate.quote_currency_id) ?? "N/A",
      rate: toNumber(rate.rate) ?? 0,
      source: rate.source,
      effectiveAt: rate.effective_at,
      updatedAt: rate.updated_at,
    })),
  };
});

export const getAnalyticsPageData = cache(async (): Promise<AnalyticsPageData> => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return {
      context: EMPTY_RESULT.context,
      metrics: [],
      variances: [],
      scenarios: [],
      summary: {
        accounts: 0,
        costCenters: 0,
        dimensions: 0,
        metrics: 0,
        variances: 0,
        scenarios: 0,
      },
      dimensionCoverage: [],
    };
  }

  const { supabase, workspace } = serverContext;
  const organizationId = workspace.organization.id;
  const [
    metricsResult,
    variancesResult,
    scenariosResult,
    dimensionsResult,
    workbookNameMap,
    forecastNameMap,
    accountNameMap,
    costCenterNameMap,
    accountsCount,
    costCentersCount,
  ] = await Promise.all([
    supabase
      .from("metrics")
      .select("id, workbook_id, name, slug, unit, actual_value, target_value, change_pct, updated_at")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<MetricRow[]>(),
    supabase
      .from("variances")
      .select("id, budget_id, forecast_id, account_id, cost_center_id, metric_id, name, period_label, plan_value, actual_value, variance_value, variance_percent, status, updated_at")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<VarianceRow[]>(),
    supabase
      .from("scenarios")
      .select("id, forecast_id, workbook_id, name, status, driver_summary, updated_at")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<ScenarioRow[]>(),
    supabase
      .from("dimensions")
      .select("id, key, name, value_options, updated_at")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<DimensionRow[]>(),
    getWorkbookNameMap(supabase, organizationId),
    getForecastNameMap(supabase, organizationId),
    getAccountNameMap(supabase, organizationId),
    getCostCenterNameMap(supabase, organizationId),
    supabase.from("accounts").select("*", { count: "exact", head: true }).eq("organization_id", organizationId),
    supabase
      .from("cost_centers")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId),
  ]);

  const error = [
    metricsResult,
    variancesResult,
    scenariosResult,
    dimensionsResult,
    accountsCount,
    costCentersCount,
  ].find((result) => result.error);

  if (error?.error) {
    throw new Error(error.error.message);
  }

  return {
    context: workspace,
    metrics: (metricsResult.data ?? []).map((metric) => ({
      id: metric.id,
      name: metric.name,
      unit: metric.unit,
      actualValue: toNumber(metric.actual_value),
      targetValue: toNumber(metric.target_value),
      changePct: toNumber(metric.change_pct),
      workbookName: metric.workbook_id ? workbookNameMap.get(metric.workbook_id) ?? null : null,
      updatedAt: metric.updated_at,
    })),
    variances: (variancesResult.data ?? []).map((variance) => ({
      id: variance.id,
      name: variance.name,
      periodLabel: variance.period_label,
      planValue: toNumber(variance.plan_value) ?? 0,
      actualValue: toNumber(variance.actual_value) ?? 0,
      varianceValue: toNumber(variance.variance_value) ?? 0,
      variancePercent: toNumber(variance.variance_percent),
      status: variance.status,
      accountName: variance.account_id ? accountNameMap.get(variance.account_id) ?? null : null,
      costCenterName:
        variance.cost_center_id ? costCenterNameMap.get(variance.cost_center_id) ?? null : null,
      updatedAt: variance.updated_at,
    })),
    scenarios: (scenariosResult.data ?? []).map((scenario) => ({
      id: scenario.id,
      name: scenario.name,
      status: scenario.status,
      workbookId: scenario.workbook_id ?? null,
      workbookName: scenario.workbook_id ? workbookNameMap.get(scenario.workbook_id) ?? null : null,
      forecastId: scenario.forecast_id ?? null,
      forecastName: scenario.forecast_id ? forecastNameMap.get(scenario.forecast_id) ?? null : null,
      drivers: Object.entries(scenario.driver_summary ?? {}).map(([key, value]) => ({
        key,
        value: String(value),
      })),
      updatedAt: scenario.updated_at,
    })),
    summary: {
      accounts: accountsCount.count ?? 0,
      costCenters: costCentersCount.count ?? 0,
      dimensions: (dimensionsResult.data ?? []).length,
      metrics: (metricsResult.data ?? []).length,
      variances: (variancesResult.data ?? []).length,
      scenarios: (scenariosResult.data ?? []).length,
    },
    dimensionCoverage: (dimensionsResult.data ?? []).map((dimension) => ({
      id: dimension.id,
      name: dimension.name,
      key: dimension.key,
      valuesCount: dimension.value_options.length,
      updatedAt: dimension.updated_at,
    })),
  };
});

export const getModelingPageData = cache(async (): Promise<ModelingPageData> => {
  const serverContext = await getWorkspaceServerContext();

  if (!serverContext) {
    return {
      accounts: [],
      costCenters: [],
      dimensions: [],
      scenarios: [],
      metrics: [],
      variances: [],
    };
  }

  const { supabase, workspace } = serverContext;
  const organizationId = workspace.organization.id;
  const [accountsResult, costCentersResult, dimensionsResult, analyticsData, owners] =
    await Promise.all([
      supabase
        .from("accounts")
        .select("id, code, name, category, updated_at")
        .eq("organization_id", organizationId)
        .order("code", { ascending: true })
        .returns<AccountRow[]>(),
      supabase
        .from("cost_centers")
        .select("id, owner_id, code, name, region, updated_at")
        .eq("organization_id", organizationId)
        .order("code", { ascending: true })
        .returns<CostCenterRow[]>(),
      supabase
        .from("dimensions")
        .select("id, key, name, value_options, updated_at")
        .eq("organization_id", organizationId)
        .order("name", { ascending: true })
        .returns<DimensionRow[]>(),
      getAnalyticsPageData(),
      getOwnerMap(supabase),
    ]);

  const error = [accountsResult, costCentersResult, dimensionsResult].find(
    (result) => result.error,
  );

  if (error?.error) {
    throw new Error(error.error.message);
  }

  return {
    accounts: (accountsResult.data ?? []).map((account) => ({
      id: account.id,
      code: account.code,
      name: account.name,
      category: account.category,
      updatedAt: account.updated_at,
    })),
    costCenters: (costCentersResult.data ?? []).map((costCenter) => ({
      id: costCenter.id,
      code: costCenter.code,
      name: costCenter.name,
      region: costCenter.region,
      owner: costCenter.owner_id ? owners.get(costCenter.owner_id) ?? "Unknown owner" : "Unassigned",
      updatedAt: costCenter.updated_at,
    })),
    dimensions: (dimensionsResult.data ?? []).map((dimension) => ({
      id: dimension.id,
      key: dimension.key,
      name: dimension.name,
      values: dimension.value_options,
      updatedAt: dimension.updated_at,
    })),
    scenarios: analyticsData.scenarios,
    metrics: analyticsData.metrics,
    variances: analyticsData.variances,
  };
});
