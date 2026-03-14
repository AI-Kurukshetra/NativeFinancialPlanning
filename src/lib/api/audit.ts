import type { ApiSupabaseClient } from "@/lib/api/route-helpers";

type AuditLogInput = {
  organizationId: string;
  actorId: string;
  entityType: string;
  entityId?: string | null;
  action: string;
  details?: Record<string, unknown>;
};

export async function logAuditEvent(
  supabase: ApiSupabaseClient,
  input: AuditLogInput,
) {
  const result = await supabase.from("audit_logs").insert({
    organization_id: input.organizationId,
    actor_id: input.actorId,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    action: input.action,
    details: input.details ?? {},
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
}
