// Stateful in-memory database store for local testing, demoing, and offline verification

import {
  UserProfile,
  Organization,
  VendorProfile,
  CustomerProfile,
  DocumentItem,
  Invoice,
  PaymentRecord,
  Ticket,
  AuditLogItem,
  VendorApprovals,
  TechnicalAssessment,
  UserRole,
} from '@/types';

export const INITIAL_MOCK_USERS: UserProfile[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@company.com',
    full_name: 'Super Administrator',
    phone: '+91 9876543210',
    department_id: '10000000-0000-0000-0000-000000000001',
    department_name: 'Information Technology',
    status: 'active',
    roles: ['super_admin'],
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-vendor-admin-01',
    email: 'vendor.ops@company.com',
    full_name: 'Alex Rivera (Vendor Ops Admin)',
    phone: '+91 9876543200',
    department_id: '10000000-0000-0000-0000-000000000005',
    department_name: 'Vendor Operations',
    status: 'active',
    roles: ['vendor_admin'],
    created_at: '2026-01-02T00:00:00Z',
  },
  {
    id: 'usr-l1-verifier-01',
    email: 'l1.verifier@company.com',
    full_name: 'Sarah Connor (L1 Doc Verifier)',
    phone: '+91 9876543211',
    department_id: '10000000-0000-0000-0000-000000000005',
    department_name: 'Compliance Verification',
    status: 'active',
    roles: ['doc_verifier'],
    created_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'usr-l2-pm-01',
    email: 'l2.pm@company.com',
    full_name: 'Arthur Pendelton (L2 Project Manager)',
    phone: '+91 9876543212',
    department_id: '10000000-0000-0000-0000-000000000002',
    department_name: 'Engineering & Projects',
    status: 'active',
    roles: ['project_manager'],
    created_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'usr-l3-mgmt-01',
    email: 'l3.mgmt@company.com',
    full_name: 'David Miller (L3 Executive Approver)',
    phone: '+91 9876543213',
    department_id: '10000000-0000-0000-0000-000000000001',
    department_name: 'Executive Management',
    status: 'active',
    roles: ['management'],
    created_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'usr-finance-01',
    email: 'finance@company.com',
    full_name: 'Elena Rostova (Finance Officer)',
    phone: '+91 9876543214',
    department_id: '10000000-0000-0000-0000-000000000003',
    department_name: 'Finance & Accounts',
    status: 'active',
    roles: ['finance_officer'],
    created_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'usr-ticket-support-01',
    email: 'support@company.com',
    full_name: 'Marcus Brody (Ticket Support Lead)',
    phone: '+91 9876543215',
    department_id: '10000000-0000-0000-0000-000000000004',
    department_name: 'Partner Support',
    status: 'active',
    roles: ['ticket_support'],
    created_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'usr-vendor-01',
    email: 'contact@apextech.com',
    full_name: 'Rajesh Sharma (Apex Tech Solutions)',
    phone: '+91 9811223344',
    status: 'active',
    roles: ['vendor'],
    created_at: '2026-02-01T00:00:00Z',
  },
];

export const INITIAL_MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-vendor-01',
    legal_name: 'Apex Tech Solutions Pvt Ltd',
    trading_name: 'Apex Technologies',
    entity_type: 'vendor',
    registration_number: 'U72200DL2021PTC384721',
    tax_id: 'AAACA1234F',
    pan: 'AAACA1234F',
    gstin: '07AAACA1234F1Z5',
    status: 'approved',
    risk_level: 'low',
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-15T00:00:00Z',
    vendor_code: 'VND-CASH-2026-00001',
  },
  {
    id: 'org-vendor-02',
    legal_name: 'Vortex Systems & Infrastructure Corp',
    trading_name: 'Vortex Systems',
    entity_type: 'vendor',
    registration_number: 'U74999MH2020PLC349120',
    tax_id: 'BBBCB5678G',
    pan: 'BBBCB5678G',
    gstin: '27BBBCB5678G1Z8',
    status: 'under_review',
    risk_level: 'medium',
    created_at: '2026-02-05T00:00:00Z',
    updated_at: '2026-02-16T00:00:00Z',
  },
  {
    id: 'org-vendor-03',
    legal_name: 'Nexus Global Logistics Solutions Ltd',
    trading_name: 'Nexus Logistics',
    entity_type: 'vendor',
    registration_number: 'U63090KA2019PLC128491',
    tax_id: 'CCCCD9012H',
    pan: 'CCCCD9012H',
    gstin: '29CCCCD9012H1Z2',
    status: 'submitted',
    risk_level: 'high',
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-02-17T00:00:00Z',
  },
];

export const INITIAL_MOCK_VENDOR_PROFILES: VendorProfile[] = [
  {
    id: 'vp-01',
    organization_id: 'org-vendor-01',
    organization_name: 'Apex Tech Solutions Pvt Ltd',
    vendor_code: 'VND-CASH-2026-00001',
    category: 'cash_vendor',
    organization_type: 'private_limited',
    msme_status: true,
    msme_category: 'small',
    year_established: 2021,
    website: 'https://apextech.com',
    nature_of_business: 'IT Infrastructure & Managed Cloud Services',
    payment_terms_days: 30,
    preferred_currency: 'INR',
    onboarding_step: 8,
    profile_completion_pct: 100,
    is_draft: false,
    activated_at: '2026-02-15T00:00:00Z',
    city: 'New Delhi',
    state: 'Delhi',
    primary_contact_name: 'Rajesh Sharma',
    primary_contact_email: 'contact@apextech.com',
    primary_contact_phone: '+91 9811223344',
  },
  {
    id: 'vp-02',
    organization_id: 'org-vendor-02',
    organization_name: 'Vortex Systems & Infrastructure Corp',
    category: 'wcc_partner',
    organization_type: 'public_limited',
    msme_status: false,
    year_established: 2020,
    website: 'https://vortexsys.com',
    nature_of_business: 'Civil Engineering & Hardware Turnkey Contracts',
    payment_terms_days: 45,
    preferred_currency: 'INR',
    onboarding_step: 6,
    profile_completion_pct: 75,
    is_draft: false,
    city: 'Mumbai',
    state: 'Maharashtra',
    primary_contact_name: 'Vikram Mehta',
    primary_contact_email: 'info@vortexsys.com',
    primary_contact_phone: '+91 9811223355',
  },
  {
    id: 'vp-03',
    organization_id: 'org-vendor-03',
    organization_name: 'Nexus Global Logistics Solutions Ltd',
    category: 'back_to_back',
    organization_type: 'public_limited',
    msme_status: false,
    year_established: 2019,
    website: 'https://nexuslogistics.com',
    nature_of_business: 'Freight Forwarding & Supply Chain Logistics',
    payment_terms_days: 60,
    preferred_currency: 'USD',
    onboarding_step: 4,
    profile_completion_pct: 50,
    is_draft: false,
    city: 'Bengaluru',
    state: 'Karnataka',
    primary_contact_name: 'Priya Nair',
    primary_contact_email: 'ops@nexuslogistics.com',
    primary_contact_phone: '+91 9811223366',
  },
];

export const INITIAL_MOCK_APPROVALS: VendorApprovals[] = [
  {
    id: 'appr-vp-01',
    vendor_id: 'vp-01',
    l1_status: 'L1 Approved',
    l1_verifier_id: 'usr-l1-verifier-01',
    l1_verifier_name: 'Sarah Connor',
    l1_comments: 'All legal, GSTIN, PAN, and banking documents verified successfully.',
    l1_completed_at: '2026-02-05T00:00:00Z',

    l2_status: 'L2 Recommended',
    l2_approver_id: 'usr-l2-pm-01',
    l2_approver_name: 'Arthur Pendelton',
    l2_comments: 'Excellent technical capability (4.8/5.0 score) and manpower availability.',
    l2_completed_at: '2026-02-10T00:00:00Z',

    l3_status: 'Approved',
    l3_approver_id: 'usr-l3-mgmt-01',
    l3_approver_name: 'David Miller',
    l3_comments: 'Approved for Cash Vendor category onboarding. Code VND-CASH-2026-00001 issued.',
    l3_completed_at: '2026-02-15T00:00:00Z',

    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-15T00:00:00Z',
  },
];

export const INITIAL_MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    organization_id: 'org-vendor-01',
    category: 'legal',
    file_name: 'GST_Certificate_ApexTech.pdf',
    storage_path: 'vendors/org-vendor-01/legal/GST_Certificate_ApexTech.pdf',
    file_size: 1024000,
    mime_type: 'application/pdf',
    version: 1,
    status: 'verified',
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-05T00:00:00Z',
  },
];

export const INITIAL_MOCK_TICKETS: Ticket[] = [];
export const INITIAL_MOCK_PAYMENTS: PaymentRecord[] = [];
export const INITIAL_MOCK_AUDIT_LOGS: AuditLogItem[] = [];

export const MOCK_USERS = [...INITIAL_MOCK_USERS];
export const MOCK_ORGANIZATIONS = [...INITIAL_MOCK_ORGANIZATIONS];
export const MOCK_VENDOR_PROFILES = [...INITIAL_MOCK_VENDOR_PROFILES];
export const MOCK_VENDORS = MOCK_VENDOR_PROFILES;
export const MOCK_APPROVALS = [...INITIAL_MOCK_APPROVALS];
export const MOCK_TECHNICAL_ASSESSMENTS: TechnicalAssessment[] = [];
export const MOCK_DOCUMENTS = [...INITIAL_MOCK_DOCUMENTS];
export const MOCK_TICKETS = [...INITIAL_MOCK_TICKETS];
export const MOCK_INVOICES: Invoice[] = [];
export const MOCK_PAYMENTS = [...INITIAL_MOCK_PAYMENTS];
export const MOCK_AUDIT_LOGS = [...INITIAL_MOCK_AUDIT_LOGS];

export const mockStore = {
  currentUserRole: 'super_admin' as UserRole,
  setCurrentUserRole(role: UserRole) {
    this.currentUserRole = role;
  },
  getUsers: () => MOCK_USERS,
  getOrganizations: () => MOCK_ORGANIZATIONS,
  organizations: MOCK_ORGANIZATIONS,
  getVendors: () => MOCK_VENDORS,
  vendors: MOCK_VENDORS,
  getApprovals: () => MOCK_APPROVALS,
  approvals: MOCK_APPROVALS,
  getDocuments: () => MOCK_DOCUMENTS,
  documents: MOCK_DOCUMENTS,
  getTickets: () => MOCK_TICKETS,
  tickets: MOCK_TICKETS,
  getInvoices: () => MOCK_INVOICES,
  invoices: MOCK_INVOICES,
  getPayments: () => MOCK_PAYMENTS,
  payments: MOCK_PAYMENTS,
  getAuditLogs: () => MOCK_AUDIT_LOGS,
  auditLogs: MOCK_AUDIT_LOGS,
  logAudit: (action: string, entity_type: string, entity_id?: string, old_data?: any, new_data?: any) => {
    MOCK_AUDIT_LOGS.unshift({
      id: `audit-${Date.now()}`,
      action,
      entity_type,
      entity_id,
      old_data,
      new_data,
      created_at: new Date().toISOString(),
    });
  },
};
