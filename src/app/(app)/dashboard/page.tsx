import { DashboardCommandCenter } from "@/components/dashboard/dashboard-command-center";
import { AppTopbar } from "@/components/shell/app-topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardPageData } from "@/lib/server/app-data";

export default async function DashboardPage() {
  const data = await getDashboardPageData();
  const context = data.context;
  const organizationName = context.organization?.name ?? "Workspace setup";
  const roleLabel = context.membership?.role ?? "member";

  return (
    <div className="space-y-6">
      <AppTopbar
        organizationName={organizationName}
        roleLabel={roleLabel}
        subtitle="Live planning health across workbooks, scenarios, KPIs, and approvals"
        title="Dashboard"
      />

      {!context.organization ? (
        <Card>
          <CardHeader>
            <CardTitle>Workspace setup incomplete</CardTitle>
            <CardDescription>
              Your session is active, but no default organization was found for this account yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Apply the Supabase onboarding migration, then sign up again or repair the missing
            membership row for this user.
          </CardContent>
        </Card>
      ) : (
        <DashboardCommandCenter
          latestNotifications={data.latestNotifications}
          metricHighlights={data.metricHighlights}
          metrics={data.metrics}
          modelCoverage={data.modelCoverage}
          openComments={data.openComments}
          pendingApprovals={data.pendingApprovals}
          planningCounts={data.planningCounts}
          recentAuditEvents={data.recentAuditEvents}
          scenarioSummary={data.scenarioSummary}
          unreadNotifications={data.unreadNotifications}
          varianceHighlights={data.varianceHighlights}
          workbooks={data.workbooks}
          workflowStatusBreakdown={data.workflowStatusBreakdown}
        />
      )}
    </div>
  );
}
