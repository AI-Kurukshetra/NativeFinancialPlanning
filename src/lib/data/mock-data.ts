import type { BudgetLine, DashboardMetric, WorkbookSummary } from "@/lib/types";

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Budget Attainment", value: "92.4%", change: 4.6, emphasis: "positive" },
  { label: "Forecast Accuracy", value: "97.1%", change: 1.3, emphasis: "positive" },
  { label: "Cycle Time", value: "3.2 days", change: -11.8, emphasis: "neutral" },
  { label: "Open Reviews", value: "07", change: 16.2, emphasis: "warning" },
];

export const workbooks: WorkbookSummary[] = [
  {
    id: "wk_annual_operating_plan",
    name: "FY27 Annual Operating Plan",
    description: "Core planning workbook for revenue, headcount, and opex.",
    status: "in_review",
    owner: "Finance Ops",
    updatedAt: "2026-03-14T10:30:00.000Z",
    collaborators: 12,
  },
  {
    id: "wk_board_package",
    name: "Board Package Draft",
    description: "Executive bridge with variance commentary and KPI summaries.",
    status: "draft",
    owner: "Strategic Finance",
    updatedAt: "2026-03-13T15:05:00.000Z",
    collaborators: 5,
  },
  {
    id: "wk_headcount_plan",
    name: "Headcount Scenario Planner",
    description: "Department hiring plan with scenario toggles and guardrails.",
    status: "published",
    owner: "People Finance",
    updatedAt: "2026-03-12T09:10:00.000Z",
    collaborators: 8,
  },
];

export const budgetLines: BudgetLine[] = [
  { name: "Revenue", plan: 1720000, actual: 1664000, variance: -56000 },
  { name: "Gross Margin", plan: 940000, actual: 911000, variance: -29000 },
  { name: "Sales & Marketing", plan: 360000, actual: 341200, variance: 18800 },
  { name: "R&D", plan: 280000, actual: 274500, variance: 5500 },
];

