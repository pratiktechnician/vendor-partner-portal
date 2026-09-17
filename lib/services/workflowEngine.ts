import { UserRole, Invoice, InvoiceStatus } from '@/types';

export interface WorkflowRuleStep {
  step_order: number;
  step_name: string;
  required_role: UserRole;
  is_department_specific: boolean;
}

export function getWorkflowForAmount(amount: number): { workflow_name: string; steps: WorkflowRuleStep[] } {
  if (amount <= 50000) {
    return {
      workflow_name: 'Standard Invoice Workflow (Up to 50k)',
      steps: [
        { step_order: 1, step_name: 'Department Verification', required_role: 'doc_verifier', is_department_specific: true },
        { step_order: 2, step_name: 'Finance Audit & Payment Scheduling', required_role: 'finance_officer', is_department_specific: false },
      ],
    };
  } else if (amount <= 500000) {
    return {
      workflow_name: 'Mid-Tier Invoice Workflow (50k - 500k)',
      steps: [
        { step_order: 1, step_name: 'Department Head Approval', required_role: 'project_manager', is_department_specific: true },
        { step_order: 2, step_name: 'Procurement Audit', required_role: 'vendor_admin', is_department_specific: false },
        { step_order: 3, step_name: 'Finance Audit & Payout Approval', required_role: 'finance_officer', is_department_specific: false },
      ],
    };
  } else {
    return {
      workflow_name: 'High-Value Invoice Workflow (Above 500k)',
      steps: [
        { step_order: 1, step_name: 'Department Head Approval', required_role: 'project_manager', is_department_specific: true },
        { step_order: 2, step_name: 'Procurement Verification', required_role: 'vendor_admin', is_department_specific: false },
        { step_order: 3, step_name: 'Finance Head Audit', required_role: 'finance_officer', is_department_specific: false },
        { step_order: 4, step_name: 'Executive Signatory Approval', required_role: 'management', is_department_specific: false },
      ],
    };
  }
}

export function evaluateNextInvoiceStatus(
  currentStatus: InvoiceStatus,
  action: 'approve' | 'reject' | 'return' | 'hold',
  currentRole: UserRole,
  grossAmount: number,
  currentStepIndex: number = 1
): { nextStatus: InvoiceStatus; nextRole?: UserRole; isFinalApproval: boolean } {
  if (action === 'reject') {
    return { nextStatus: 'rejected', isFinalApproval: false };
  }

  if (action === 'return') {
    return { nextStatus: 'correction_required', isFinalApproval: false };
  }

  if (action === 'hold') {
    return { nextStatus: 'on_hold', isFinalApproval: false };
  }

  const workflow = getWorkflowForAmount(grossAmount);
  const totalSteps = workflow.steps.length;

  if (currentStepIndex >= totalSteps) {
    return { nextStatus: 'approved_for_payment', isFinalApproval: true };
  }

  const nextStep = workflow.steps[currentStepIndex]; // 0-indexed for next step
  const statusMap: Record<UserRole, InvoiceStatus> = {
    super_admin: 'finance_approval_pending',
    vendor_admin: 'procurement_approval_pending',
    doc_verifier: 'initial_validation',
    project_manager: 'dept_approval_pending',
    management: 'finance_approval_pending',
    finance_officer: 'finance_approval_pending',
    commercial_officer: 'dept_approval_pending',
    ticket_support: 'initial_validation',
    auditor: 'initial_validation',
    vendor: 'submitted',
    customer: 'submitted',
  };

  return {
    nextStatus: statusMap[nextStep.required_role] || 'finance_approval_pending',
    nextRole: nextStep.required_role,
    isFinalApproval: false,
  };
}

export function detectDuplicateInvoice(
  existingInvoices: Invoice[],
  newInvoiceNumber: string,
  organizationId: string,
  poNumber?: string,
  grossAmount?: number
): { isDuplicateNumber: boolean; isPotentialDuplicatePo: boolean; message?: string } {
  const isDuplicateNumber = existingInvoices.some(
    (inv) => inv.organization_id === organizationId && inv.invoice_number.toLowerCase().trim() === newInvoiceNumber.toLowerCase().trim()
  );

  if (isDuplicateNumber) {
    return {
      isDuplicateNumber: true,
      isPotentialDuplicatePo: false,
      message: `Invoice number "${newInvoiceNumber}" has already been submitted for this organization.`,
    };
  }

  const isPotentialDuplicatePo = existingInvoices.some(
    (inv) =>
      inv.organization_id === organizationId &&
      poNumber &&
      inv.po_number?.toLowerCase() === poNumber.toLowerCase() &&
      inv.gross_amount === grossAmount
  );

  if (isPotentialDuplicatePo) {
    return {
      isDuplicateNumber: false,
      isPotentialDuplicatePo: true,
      message: `Warning: A previous invoice with matching PO number "${poNumber}" and gross amount ₹${grossAmount?.toLocaleString()} was found.`,
    };
  }

  return { isDuplicateNumber: false, isPotentialDuplicatePo: false };
}
