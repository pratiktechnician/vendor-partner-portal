import { mockStore } from '@/lib/supabase/mockDb';

export interface AuditParams {
  actor_id?: string;
  actor_name?: string;
  actor_role?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  ip_address?: string;
}

export async function logAuditEvent(params: AuditParams) {
  try {
    return mockStore.logAudit(
      params.action,
      params.entity_type,
      params.entity_id,
      params.old_data,
      params.new_data
    );
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
}
