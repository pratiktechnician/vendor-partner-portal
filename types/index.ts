// Central TypeScript types for Enterprise Vendor Management & Partner Onboarding Platform

export type UserRole =
  | 'super_admin'
  | 'vendor_admin'
  | 'vendor'
  | 'customer'
  | 'doc_verifier'
  | 'project_manager'
  | 'management'
  | 'finance_officer'
  | 'commercial_officer'
  | 'ticket_support'
  | 'auditor';

export type VendorCategory = 'cash_vendor' | 'wcc_partner' | 'back_to_back';

export type L1ApprovalStatus = 'Pending L1' | 'Under Verification' | 'Correction Required' | 'L1 Approved' | 'L1 Rejected';
export type L2ApprovalStatus = 'Pending Technical Review' | 'Technical Review In Progress' | 'Clarification Required' | 'L2 Recommended' | 'L2 Rejected';
export type L3ApprovalStatus = 'Pending Management Approval' | 'Approved' | 'Rejected' | 'Returned for Review';

export type EntityStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'correction_required'
  | 'l1_approved'
  | 'l2_recommended'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'expired';

export type DocumentStatus =
  | 'missing'
  | 'uploaded'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'correction_required'
  | 'expired'
  | 'expiring_soon';

export type InvoiceStatus =
  | 'draft'
  | 'submitted'
  | 'initial_validation'
  | 'correction_required'
  | 'dept_approval_pending'
  | 'procurement_approval_pending'
  | 'finance_approval_pending'
  | 'approved_for_payment'
  | 'on_hold'
  | 'partially_paid'
  | 'paid'
  | 'rejected'
  | 'cancelled';

export type PaymentStatus =
  | 'not_initiated'
  | 'scheduled'
  | 'processing'
  | 'partially_paid'
  | 'paid'
  | 'failed'
  | 'reversed';

export type TicketStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'waiting_for_vendor'
  | 'waiting_for_internal'
  | 'escalated'
  | 'resolved'
  | 'closed'
  | 'reopened';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type SLAStatus = 'Within SLA' | 'SLA Approaching' | 'SLA Breached';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  department_id?: string;
  department_name?: string;
  status: 'active' | 'suspended';
  avatar_url?: string;
  roles: UserRole[];
  created_at: string;
}

export interface Organization {
  id: string;
  legal_name: string;
  trading_name?: string;
  entity_type: 'vendor' | 'customer';
  registration_number?: string;
  tax_id?: string;
  pan?: string;
  gstin?: string;
  status: EntityStatus;
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  vendor_code?: string;
  customer_code?: string;
}

export interface VendorProfile {
  id: string;
  organization_id: string;
  organization_name?: string;
  vendor_code?: string;
  category: VendorCategory;
  organization_type?: string;
  msme_status: boolean;
  msme_category?: string;
  year_established?: number;
  website?: string;
  nature_of_business?: string;
  payment_terms_days: number;
  preferred_currency: string;
  onboarding_step: number;
  profile_completion_pct: number;
  is_draft: boolean;
  activated_at?: string;
  operating_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  secondary_contact_name?: string;
  secondary_contact_phone?: string;
  cin_number?: string;
  expertise_areas?: string[];
  service_locations?: string[];
  client_references?: { client_name: string; contact_person: string; email: string; phone: string }[];
  categories?: string[];
}

export interface VendorApprovals {
  id: string;
  vendor_id: string;
  l1_status: L1ApprovalStatus;
  l1_verifier_id?: string;
  l1_verifier_name?: string;
  l1_comments?: string;
  l1_completed_at?: string;
  
  l2_status: L2ApprovalStatus;
  l2_approver_id?: string;
  l2_approver_name?: string;
  l2_comments?: string;
  l2_completed_at?: string;
  
  l3_status: L3ApprovalStatus;
  l3_approver_id?: string;
  l3_approver_name?: string;
  l3_comments?: string;
  l3_completed_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface TechnicalAssessment {
  id: string;
  vendor_id: string;
  assessor_id: string;
  assessor_name?: string;
  technical_capability: number; // 1 to 5
  relevant_experience: number; // 1 to 5
  resource_availability: number; // 1 to 5
  geographical_capability: number; // 1 to 5
  safety_readiness: number; // 1 to 5
  quality_capability: number; // 1 to 5
  delivery_capability: number; // 1 to 5
  documentation_capability: number; // 1 to 5
  overall_score: number;
  assessment_notes: string;
  recommendation: 'recommend' | 'reject' | 'request_clarification';
  created_at: string;
}

export interface CustomerProfile {
  id: string;
  organization_id: string;
  customer_code?: string;
  customer_type?: string;
  billing_currency: string;
  requested_services?: string[];
}

export interface Address {
  id?: string;
  organization_id?: string;
  address_type: 'registered' | 'billing' | 'operational' | 'service';
  street_address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface Contact {
  id?: string;
  organization_id?: string;
  contact_type: 'primary' | 'secondary' | 'finance' | 'signatory';
  name: string;
  email: string;
  phone: string;
  designation?: string;
}

export interface BankAccount {
  id: string;
  organization_id: string;
  bank_name: string;
  account_holder: string;
  account_number_masked: string;
  branch_name: string;
  ifsc_swift_code: string;
  is_verified: boolean;
}

export interface DocumentRequirement {
  id: string;
  target_type: 'vendor' | 'customer';
  category_code?: VendorCategory;
  document_type: string;
  title: string;
  description?: string;
  is_mandatory: boolean;
  validity_days?: number;
}

export interface DocumentItem {
  id: string;
  organization_id: string;
  requirement_id?: string;
  category: string;
  file_name: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  version: number;
  issue_date?: string;
  expiry_date?: string;
  status: DocumentStatus;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  signed_url?: string;
  rejection_reason?: string;
  internal_comments?: string;
}

export interface PaymentWorkflowStage {
  stage_order: number;
  stage_name: string;
  responsible_role: UserRole;
  sla_hours: number;
  mandatory_evidence?: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface InvoiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  unit: string;
  unit_rate: number;
  tax_rate: number;
  tax_amount: number;
  line_total: number;
}

export interface Invoice {
  id: string;
  organization_id: string;
  organization_name?: string;
  vendor_code?: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  po_number?: string;
  work_order_no?: string;
  department_id?: string;
  department_name?: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  gross_amount: number;
  status: InvoiceStatus;
  remarks?: string;
  created_at: string;
  line_items?: InvoiceLineItem[];
  documents?: { id: string; doc_type: string; file_name: string; storage_path: string }[];
  current_step_name?: string;
  pending_role?: UserRole;
}

export interface PaymentRecord {
  id: string;
  invoice_id: string;
  invoice_number?: string;
  vendor_name?: string;
  approved_amount: number;
  deduction_amount: number;
  tax_deducted: number;
  net_payable_amount: number;
  payment_batch_no?: string;
  payment_method: 'NEFT' | 'RTGS' | 'UPI' | 'Wire' | 'Cheque';
  transaction_ref: string;
  payment_date: string;
  status: PaymentStatus;
  remarks?: string;
  payment_advice_url?: string;
}

export interface TicketInternalNote {
  id: string;
  ticket_id: string;
  author_id: string;
  author_name: string;
  note: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  organization_id: string;
  organization_name?: string;
  ticket_number: string; // TKT-2026-XXXXXX
  category: 'payment' | 'invoice' | 'portal_access' | 'document_clarification' | 'vendor_code' | 'contract' | 'onboarding' | 'commercial' | 'grievance' | 'other';
  subject: string;
  description?: string;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to_name?: string;
  assigned_to_id?: string;
  created_by_name?: string;
  created_at: string;
  sla_due_at?: string;
  sla_status?: SLAStatus;
  messages?: TicketMessage[];
  internal_notes?: TicketInternalNote[];
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  message: string;
  attachment_path?: string;
  is_internal?: boolean;
  created_at: string;
}

export interface VendorRiskSignals {
  vendor_id: string;
  vendor_name: string;
  risk_level: 'low' | 'medium' | 'high';
  reasons: string[];
}

export interface AuditLogItem {
  id: string;
  actor_id?: string;
  actor_name?: string;
  actor_role?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}
