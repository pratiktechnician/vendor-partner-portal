-- ====================================================================
-- VENDOR AND CUSTOMER MANAGEMENT PORTAL - INITIAL DATABASE MIGRATION
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enums
CREATE TYPE user_role_enum AS ENUM (
    'super_admin',
    'vendor',
    'customer',
    'doc_verifier',
    'procurement_officer',
    'dept_approver',
    'finance_officer',
    'auditor'
);

CREATE TYPE entity_status_enum AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'correction_required',
    'procurement_review',
    'approved',
    'rejected',
    'suspended',
    'expired'
);

CREATE TYPE doc_status_enum AS ENUM (
    'not_uploaded',
    'uploaded',
    'under_review',
    'approved',
    'rejected',
    'correction_required',
    'expired'
);

CREATE TYPE invoice_status_enum AS ENUM (
    'draft',
    'submitted',
    'initial_validation',
    'correction_required',
    'dept_approval_pending',
    'procurement_approval_pending',
    'finance_approval_pending',
    'approved_for_payment',
    'on_hold',
    'partially_paid',
    'paid',
    'rejected',
    'cancelled'
);

CREATE TYPE payment_status_enum AS ENUM (
    'not_initiated',
    'scheduled',
    'processing',
    'partially_paid',
    'paid',
    'failed',
    'reversed'
);

CREATE TYPE ticket_status_enum AS ENUM (
    'open',
    'assigned',
    'awaiting_user',
    'resolved',
    'closed'
);

-- 3. Trigger Function for Updated Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. User Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    department_id UUID,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Roles & Permissions Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name user_role_enum NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- 6. Departments Table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    head_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ADD CONSTRAINT fk_profiles_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- 7. Organizations Table (Vendors & Customers)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legal_name TEXT NOT NULL,
    trading_name TEXT,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('vendor', 'customer')),
    registration_number TEXT,
    tax_id TEXT,
    pan TEXT,
    gstin TEXT,
    status entity_status_enum NOT NULL DEFAULT 'draft',
    risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_in_org TEXT NOT NULL DEFAULT 'member',
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- 8. Vendor Profiles
CREATE TABLE vendor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    vendor_code TEXT UNIQUE,
    organization_type TEXT,
    msme_status BOOLEAN DEFAULT false,
    msme_category TEXT,
    year_established INTEGER,
    website TEXT,
    nature_of_business TEXT,
    payment_terms_days INTEGER DEFAULT 30,
    preferred_currency TEXT DEFAULT 'INR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Customer Profiles
CREATE TABLE customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    customer_code TEXT UNIQUE,
    customer_type TEXT,
    billing_currency TEXT DEFAULT 'INR',
    requested_services TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Addresses
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    address_type TEXT NOT NULL CHECK (address_type IN ('registered', 'billing', 'operational', 'service')),
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    postal_code TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    contact_type TEXT NOT NULL CHECK (contact_type IN ('primary', 'secondary', 'finance', 'signatory')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    designation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Bank Accounts (Masked & Encrypted storage)
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_holder TEXT NOT NULL,
    account_number_encrypted TEXT NOT NULL,
    account_number_masked TEXT NOT NULL,
    branch_name TEXT NOT NULL,
    ifsc_swift_code TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Business & Vendor Categories
CREATE TABLE business_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vendor_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES business_categories(id) ON DELETE CASCADE,
    UNIQUE(vendor_profile_id, category_id)
);

-- 14. Document Requirements Configuration
CREATE TABLE document_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type TEXT NOT NULL CHECK (target_type IN ('vendor', 'customer')),
    document_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    validity_days INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Documents & Versions
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES document_requirements(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    issue_date DATE,
    expiry_date DATE,
    status doc_status_enum NOT NULL DEFAULT 'uploaded',
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE document_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status doc_status_enum NOT NULL,
    rejection_reason TEXT,
    internal_comments TEXT,
    public_comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Invoices & Line Items
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    po_number TEXT,
    work_order_no TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    subtotal NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    gross_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    status invoice_status_enum NOT NULL DEFAULT 'submitted',
    remarks TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, invoice_number)
);

CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC(12,2) NOT NULL DEFAULT 1,
    unit TEXT DEFAULT 'nos',
    unit_rate NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    line_total NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invoice_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('invoice_pdf', 'po_copy', 'grn_copy', 'completion_cert', 'tax_doc', 'supporting')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Approval Workflows Engine
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    min_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    max_amount NUMERIC(15,2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE approval_workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    required_role user_role_enum NOT NULL,
    is_department_specific BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workflow_id, step_order)
);

CREATE TABLE approval_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL UNIQUE REFERENCES invoices(id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE RESTRICT,
    current_step_order INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'returned', 'on_hold')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE approval_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    approval_instance_id UUID NOT NULL REFERENCES approval_instances(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'returned', 'hold', 'released')),
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Payment Tracking Module
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL UNIQUE REFERENCES invoices(id) ON DELETE CASCADE,
    approved_amount NUMERIC(15,2) NOT NULL,
    deduction_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    tax_deducted NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    net_payable_amount NUMERIC(15,2) NOT NULL,
    payment_batch_no TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('NEFT', 'RTGS', 'UPI', 'Wire', 'Cheque')),
    transaction_ref TEXT NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status payment_status_enum NOT NULL DEFAULT 'scheduled',
    payment_advice_doc_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    remarks TEXT,
    processed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. Queries & Support Tickets
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ticket_number TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('registration', 'document', 'invoice', 'payment', 'technical')),
    subject TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status ticket_status_enum NOT NULL DEFAULT 'open',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachment_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. Notifications System
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    read BOOLEAN NOT NULL DEFAULT false,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. Immutable Audit Trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_role TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    correlation_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. System Settings
CREATE TABLE system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ====================================================================
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_vendor_profiles_updated_at BEFORE UPDATE ON vendor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_approval_instances_updated_at BEFORE UPDATE ON approval_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security function to check if user has admin/internal role
CREATE OR REPLACE FUNCTION is_internal_employee(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_uuid
        AND r.name IN ('super_admin', 'doc_verifier', 'procurement_officer', 'dept_approver', 'finance_officer', 'auditor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policy: Profiles
CREATE POLICY "Users can view own profile or internal users view all" ON profiles
    FOR SELECT USING (auth.uid() = id OR is_internal_employee(auth.uid()));

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policy: Organizations
CREATE POLICY "Members view own organization, internal view all" ON organizations
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM organization_members WHERE organization_id = id AND user_id = auth.uid())
        OR is_internal_employee(auth.uid())
    );

-- RLS Policy: Bank Accounts (Restricted access)
CREATE POLICY "Finance and Admin view bank accounts, Vendor views own" ON bank_accounts
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM organization_members WHERE organization_id = bank_accounts.organization_id AND user_id = auth.uid())
        OR EXISTS (
            SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'finance_officer')
        )
    );

-- RLS Policy: Invoices
CREATE POLICY "Vendor views own invoices, internal employees view assigned" ON invoices
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM organization_members WHERE organization_id = invoices.organization_id AND user_id = auth.uid())
        OR is_internal_employee(auth.uid())
    );

-- RLS Policy: Audit Logs (No DELETE or UPDATE allowed)
CREATE POLICY "Super admin and auditors view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'auditor')
        )
    );
