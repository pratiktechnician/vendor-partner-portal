import { VendorRiskSignals } from '@/types';
import { MOCK_DOCUMENTS, MOCK_TICKETS, MOCK_APPROVALS } from '@/lib/supabase/mockDb';

export class RiskIndicatorService {
  /**
   * Calculate explainable rules-based risk indicator for a vendor
   */
  static calculateVendorRisk(vendorId: string, vendorName: string): VendorRiskSignals {
    const reasons: string[] = [];

    // Signal 1: Missing or expired mandatory documents
    const vendorDocs = MOCK_DOCUMENTS.filter((d) => d.organization_id === vendorId);
    const expiredDocs = vendorDocs.filter((d) => d.status === 'expired');
    const missingDocs = vendorDocs.filter((d) => d.status === 'missing');

    if (expiredDocs.length > 0) {
      reasons.push(`${expiredDocs.length} mandatory document(s) expired`);
    }
    if (missingDocs.length > 0) {
      reasons.push(`${missingDocs.length} required compliance document(s) missing`);
    }

    // Signal 2: Unresolved critical or high priority tickets
    const vendorTickets = MOCK_TICKETS.filter((t) => t.organization_id === vendorId);
    const criticalTickets = vendorTickets.filter(
      (t) => (t.priority === 'critical' || t.priority === 'high') && t.status !== 'closed' && t.status !== 'resolved'
    );

    if (criticalTickets.length > 0) {
      reasons.push(`${criticalTickets.length} unresolved high/critical grievance ticket(s)`);
    }

    // Signal 3: Rejected approval stages
    const approval = MOCK_APPROVALS.find((a) => a.vendor_id === vendorId);
    if (approval) {
      if (approval.l1_status === 'L1 Rejected' || approval.l2_status === 'L2 Rejected' || approval.l3_status === 'Rejected') {
        reasons.push('Previous onboarding approval stage rejected');
      }
    }

    let risk_level: 'low' | 'medium' | 'high' = 'low';
    if (reasons.length >= 2 || expiredDocs.length > 0) {
      risk_level = 'high';
    } else if (reasons.length === 1) {
      risk_level = 'medium';
    }

    return {
      vendor_id: vendorId,
      vendor_name: vendorName,
      risk_level,
      reasons: reasons.length > 0 ? reasons : ['No compliance or operational risk signals detected'],
    };
  }
}
