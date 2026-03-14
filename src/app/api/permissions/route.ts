import { NextResponse, type NextRequest } from "next/server";

import { requireApiAccess } from "@/lib/api/route-helpers";

export async function GET(request: NextRequest) {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const workbookId = request.nextUrl.searchParams.get("workbookId");
  const role = access.workspace.membership.role;
  const canEditOrganization = role === "admin";
  const canEditWorkbook = role === "admin" || role === "editor";
  const canApprove = role === "admin" || role === "approver";

  return NextResponse.json({
    data: {
      organizationId: access.workspace.organization.id,
      role,
      capabilities: {
        canView: true,
        canCreateWorkbook: canEditWorkbook,
        canEditWorkbook,
        canManageOrganization: canEditOrganization,
        canApprove,
        canComment: true,
        canCreateSnapshots: canEditWorkbook,
      },
      workbookId,
    },
  });
}
