import type { NavItem } from "@/lib/types";

export const marketingNav: NavItem[] = [
  { href: "/#definition", label: "Definition" },
  { href: "/#platform", label: "Platform" },
  { href: "/#workflow", label: "Workflow" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Login" },
];

export const appNav: NavItem[] = [
  { href: "/workspace", label: "Workspace", description: "Organizations and access" },
  { href: "/dashboard", label: "Dashboard", description: "Executive overview" },
  { href: "/analytics", label: "Analytics", description: "KPI health and variance watch" },
  {
    href: "/workbooks",
    label: "Workbooks",
    description: "Spreadsheet-native models",
  },
  {
    href: "/budgets",
    label: "Budgets",
    description: "Planning cycles and approvals",
  },
  {
    href: "/forecasts",
    label: "Forecasts",
    description: "Rolling outlook and scenarios",
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Exports and board packs",
  },
  {
    href: "/modeling",
    label: "Modeling",
    description: "Scenarios and finance structure",
  },
  {
    href: "/currencies",
    label: "Currencies",
    description: "Base currency and FX context",
  },
  {
    href: "/templates",
    label: "Templates",
    description: "Reusable planning blueprints",
  },
  {
    href: "/workflows",
    label: "Workflows",
    description: "Approvals and review routing",
  },
  {
    href: "/integrations",
    label: "Integrations",
    description: "Connected data sources",
  },
  {
    href: "/notifications",
    label: "Inbox",
    description: "Alerts and action items",
  },
];
