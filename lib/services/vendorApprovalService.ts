import { L1ApprovalStatus, L2ApprovalStatus, L3ApprovalStatus, VendorApprovals, TechnicalAssessment } from '@/types';
import { MOCK_APPROVALS, MOCK_TECHNICAL_ASSESSMENTS, MOCK_VENDORS } from '@/lib/supabase/mockDb';

export class VendorApprovalService {
  /**
   * Fetch L1, L2, L3 approval state for a given vendor
   */
  static async getVendorApprovals(vendorId: string): Promise<VendorApprovals | null> {
    const approval = MOCK_APPROVALS.find((a) => a.vendor_id === vendorId);
    if (approval) return approval;

    // Default pending record
    const defaultApproval: VendorApprovals = {
      id: `appr-${vendorId}`,
      vendor_id: vendorId,
      l1_status: 'Pending L1',
      l2_status: 'Pending Technical Review',
      l3_status: 'Pending Management Approval',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_APPROVALS.push(defaultApproval);
    return defaultApproval;
  }

  /**
   * Process L1 Document Verification
   */
  static async processL1Review(
    vendorId: string,
    verifierId: string,
    verifierName: string,
    status: L1ApprovalStatus,
    comments?: string
  ): Promise<VendorApprovals> {
    const approval = await this.getVendorApprovals(vendorId);
    if (!approval) throw new Error('Vendor approval record not found');

    approval.l1_status = status;
    approval.l1_verifier_id = verifierId;
    approval.l1_verifier_name = verifierName;
    approval.l1_comments = comments;
    approval.l1_completed_at = new Date().toISOString();
    approval.updated_at = new Date().toISOString();

    // If L1 approved, move L2 status from Pending to Technical Review In Progress
    if (status === 'L1 Approved' && approval.l2_status === 'Pending Technical Review') {
      approval.l2_status = 'Technical Review In Progress';
    }

    return approval;
  }

  /**
   * Process L2 Technical Assessment
   */
  static async processL2Assessment(
    assessmentData: Omit<TechnicalAssessment, 'id' | 'created_at'>
  ): Promise<{ approval: VendorApprovals; assessment: TechnicalAssessment }> {
    const approval = await this.getVendorApprovals(assessmentData.vendor_id);
    if (!approval) throw new Error('Vendor approval record not found');

    // Rule 1: L2 cannot happen before L1 approval
    if (approval.l1_status !== 'L1 Approved') {
      throw new Error('L1 Document Verification must be completed and approved before starting L2 Technical Assessment.');
    }

    const scores = [
      assessmentData.technical_capability,
      assessmentData.relevant_experience,
      assessmentData.resource_availability,
      assessmentData.geographical_capability,
      assessmentData.safety_readiness,
      assessmentData.quality_capability,
      assessmentData.delivery_capability,
      assessmentData.documentation_capability,
    ];
    const overallScore = parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));

    const newAssessment: TechnicalAssessment = {
      ...assessmentData,
      id: `ta-${Date.now()}`,
      overall_score: overallScore,
      created_at: new Date().toISOString(),
    };
    MOCK_TECHNICAL_ASSESSMENTS.push(newAssessment);

    if (assessmentData.recommendation === 'recommend') {
      approval.l2_status = 'L2 Recommended';
      approval.l3_status = 'Pending Management Approval';
    } else if (assessmentData.recommendation === 'reject') {
      approval.l2_status = 'L2 Rejected';
    } else {
      approval.l2_status = 'Clarification Required';
    }

    approval.l2_approver_id = assessmentData.assessor_id;
    approval.l2_approver_name = assessmentData.assessor_name || 'Project Manager';
    approval.l2_comments = assessmentData.assessment_notes;
    approval.l2_completed_at = new Date().toISOString();
    approval.updated_at = new Date().toISOString();

    return { approval, assessment: newAssessment };
  }

  /**
   * Process L3 Management Approval
   */
  static async processL3Decision(
    vendorId: string,
    approverId: string,
    approverName: string,
    action: 'approve' | 'reject' | 'return_l1' | 'return_l2',
    comments?: string
  ): Promise<{ approval: VendorApprovals; generatedCode?: string }> {
    const approval = await this.getVendorApprovals(vendorId);
    if (!approval) throw new Error('Vendor approval record not found');

    // Rule 2: L3 Management Approval cannot happen before L1 & L2 are completed
    if (approval.l1_status !== 'L1 Approved') {
      throw new Error('L1 Document Verification must be completed before Management Approval.');
    }
    if (approval.l2_status !== 'L2 Recommended') {
      throw new Error('L2 Technical Assessment must be recommended before Management Approval.');
    }

    approval.l3_approver_id = approverId;
    approval.l3_approver_name = approverName;
    approval.l3_comments = comments;
    approval.l3_completed_at = new Date().toISOString();
    approval.updated_at = new Date().toISOString();

    let generatedCode: string | undefined = undefined;

    if (action === 'approve') {
      approval.l3_status = 'Approved';

      // Rule 3: Vendor code generation happens ONLY after L3 Final Approval
      const vendor = MOCK_VENDORS.find((v) => v.id === vendorId);
      if (vendor) {
        const categoryCode = (vendor.category || 'cash_vendor').toUpperCase().replace('_PARTNER', '').replace('_VENDOR', '');
        const year = new Date().getFullYear();
        const randSeq = String(Math.floor(1000 + Math.random() * 9000));
        generatedCode = `VND-${categoryCode}-${year}-${randSeq}`;
        vendor.vendor_code = generatedCode;
        vendor.activated_at = new Date().toISOString();
      }
    } else if (action === 'reject') {
      approval.l3_status = 'Rejected';
    } else if (action === 'return_l1') {
      approval.l3_status = 'Returned for Review';
      approval.l1_status = 'Correction Required';
    } else if (action === 'return_l2') {
      approval.l3_status = 'Returned for Review';
      approval.l2_status = 'Clarification Required';
    }

    return { approval, generatedCode };
  }
}
