import { NextResponse } from "next/server";

import { apiError, requireApiAccess } from "@/lib/api/route-helpers";

type MetricRow = {
  id: string;
  name: string;
  unit: string;
  actual_value: number | string | null;
  target_value: number | string | null;
  change_pct: number | string | null;
};

type VarianceRow = {
  id: string;
  name: string;
  period_label: string;
  variance_value: number | string;
  variance_percent: number | string | null;
  status: string;
};

type ScenarioRow = {
  id: string;
  name: string;
  status: string;
  forecast_id: string | null;
};

type DimensionRow = {
  id: string;
  key: string;
  name: string;
  value_options: string[];
};

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

export async function GET() {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const organizationId = access.workspace.organization.id;
  const [
    metricsResult,
    variancesResult,
    scenariosResult,
    dimensionsResult,
    accountsCount,
    costCentersCount,
    reportsCount,
    workflowsCount,
  ] = await Promise.all([
    access.supabase
      .from("metrics")
      .select("id, name, unit, actual_value, target_value, change_pct")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<MetricRow[]>(),
    access.supabase
      .from("variances")
      .select("id, name, period_label, variance_value, variance_percent, status")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<VarianceRow[]>(),
    access.supabase
      .from("scenarios")
      .select("id, name, status, forecast_id")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<ScenarioRow[]>(),
    access.supabase
      .from("dimensions")
      .select("id, key, name, value_options")
      .eq("organization_id", organizationId)
      .returns<DimensionRow[]>(),
    access.supabase.from("accounts").select("*", { count: "exact", head: true }).eq("organization_id", organizationId),
    access.supabase.from("cost_centers").select("*", { count: "exact", head: true }).eq("organization_id", organizationId),
    access.supabase.from("reports").select("*", { count: "exact", head: true }).eq("organization_id", organizationId),
    access.supabase.from("workflows").select("*", { count: "exact", head: true }).eq("organization_id", organizationId),
  ]);

  const error = [
    metricsResult,
    variancesResult,
    scenariosResult,
    dimensionsResult,
    accountsCount,
    costCentersCount,
    reportsCount,
    workflowsCount,
  ].find((result) => result.error);

  if (error?.error) {
    return apiError(error.error.message, 500);
  }

  const metrics = metricsResult.data ?? [];
  const variances = variancesResult.data ?? [];
  const scenarios = scenariosResult.data ?? [];

  return NextResponse.json({
    data: {
      summary: {
        metrics: metrics.length,
        variances: variances.length,
        scenarios: scenarios.length,
        accounts: accountsCount.count ?? 0,
        costCenters: costCentersCount.count ?? 0,
        reports: reportsCount.count ?? 0,
        workflows: workflowsCount.count ?? 0,
      },
      scenarioCoverage: {
        active: scenarios.filter((scenario) => scenario.status === "active").length,
        linkedForecasts: new Set(
          scenarios.flatMap((scenario) => (scenario.forecast_id ? [scenario.forecast_id] : [])),
        ).size,
      },
      metrics: metrics.map((metric) => ({
        id: metric.id,
        name: metric.name,
        unit: metric.unit,
        actualValue: toNumber(metric.actual_value),
        targetValue: toNumber(metric.target_value),
        changePct: toNumber(metric.change_pct),
      })),
      variances: variances.map((variance) => ({
        id: variance.id,
        name: variance.name,
        periodLabel: variance.period_label,
        varianceValue: toNumber(variance.variance_value),
        variancePercent: toNumber(variance.variance_percent),
        status: variance.status,
      })),
      dimensions: (dimensionsResult.data ?? []).map((dimension) => ({
        id: dimension.id,
        key: dimension.key,
        name: dimension.name,
        valuesCount: dimension.value_options.length,
      })),
    },
  });
}
