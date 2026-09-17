-- ====================================================================
-- VENDOR PLATFORM UPGRADE MIGRATION: 3 CATEGORIES, 3-TIER APPROVALS, 
-- TRANSACTIONAL VENDOR CODES, OPEN TICKETING & SLA TRACKING
-- ====================================================================

-- 1. Custom Enums Extension
DO $$ BEGIN
    CREATE TYPE vendor_category_enum AS ENUM ('cash_vendor', 'wcc_partner', 'back_to_back');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE l1_approval_status AS ENUM ('Pending L1', 'Under Verification', 'Correction Required', 'L1 Approved', 'L1 Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE l2_approval_status AS ENUM ('Pending Technical Review', 'Technical Review In Progress', 'Clarification Required', 'L2 Recommended', 'L2 Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE l3_approval_status AS ENUM ('Pending Management Approval', 'Approved', 'Rejected', 'Returned for Review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Expand user roles enum if needed
ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'project_manager';
ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'management';
ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'vendor_admin';
ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'ticket_support';
ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'commercial_officer';

-- 2. Vendor Categories Definition Table
CREATE TABLE IF NOT EXISTS vendor_categories_def (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code vendor_category_enum NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    prefix TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO vendor_categories_def (code, display_name, prefix, description) VALUES
('cash_vendor', 'Cash Vendor', 'VND-CASH', 'Direct work completion & invoice validation workflow'),
('wcc_partner', 'WCC Partner', 'VND-WCC', 'Work order, milestone completion & WCC verification workflow'),
('back_to_back', 'Back-to-Back Partner', 'VND-B2B', 'Customer milestone, partner validation & commercial acceptance workflow')
ON CONFLICT (code) DO NOTHING;

-- Alter vendor_profiles to add category & activation details
ALTER TABLE vendor_profiles 
ADD COLUMN IF NOT EXISTS category vendor_category_enum DEFAULT 'cash_vendor',
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS profile_completion_pct INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS operating_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_name TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_email TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS secondary_contact_name TEXT,
ADD COLUMN IF NOT EXISTS secondary_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS cin_number TEXT,
ADD COLUMN IF NOT EXISTS expertise_areas TEXT[],
ADD COLUMN IF NOT EXISTS service_locations TEXT[],
ADD COLUMN IF NOT EXISTS client_references JSONB DEFAULT '[]'::jsonb;

-- 3. Payment Workflows Definitions & Stages
CREATE TABLE IF NOT EXISTS payment_workflows_def (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code vendor_category_enum NOT NULL REFERENCES vendor_categories_def(code) ON DELETE CASCADE,
    workflow_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_workflow_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES payment_workflows_def(id) ON DELETE CASCADE,
    stage_order INTEGER NOT NULL,
    stage_name TEXT NOT NULL,
    responsible_role user_role_enum NOT NULL,
    sla_hours INTEGER NOT NULL DEFAULT 48,
    mandatory_evidence TEXT,
    requires_approval BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workflow_id, stage_order)
);

-- 4. 3-Tier Approval Workflow Gating Table (L1, L2, L3)
CREATE TABLE IF NOT EXISTS vendor_approvals_l1_l2_l3 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL UNIQUE REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    
    -- L1 Document Verification
    l1_status l1_approval_status NOT NULL DEFAULT 'Pending L1',
    l1_verifier_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    l1_comments TEXT,
    l1_completed_at TIMESTAMPTZ,
    
    -- L2 Technical Assessment
    l2_status l2_approval_status NOT NULL DEFAULT 'Pending Technical Review',
    l2_approver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    l2_comments TEXT,
    l2_completed_at TIMESTAMPTZ,
    
    -- L3 Final Management Approval
    l3_status l3_approval_status NOT NULL DEFAULT 'Pending Management Approval',
    l3_approver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    l3_comments TEXT,
    l3_completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. L2 Technical Assessment Details Table
CREATE TABLE IF NOT EXISTS technical_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    assessor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    technical_capability INTEGER CHECK (technical_capability BETWEEN 1 AND 5),
    relevant_experience INTEGER CHECK (relevant_experience BETWEEN 1 AND 5),
    resource_availability INTEGER CHECK (resource_availability BETWEEN 1 AND 5),
    geographical_capability INTEGER CHECK (geographical_capability BETWEEN 1 AND 5),
    safety_readiness INTEGER CHECK (safety_readiness BETWEEN 1 AND 5),
    quality_capability INTEGER CHECK (quality_capability BETWEEN 1 AND 5),
    delivery_capability INTEGER CHECK (delivery_capability BETWEEN 1 AND 5),
    documentation_capability INTEGER CHECK (documentation_capability BETWEEN 1 AND 5),
    overall_score NUMERIC(3,2),
    assessment_notes TEXT,
    recommendation TEXT NOT NULL CHECK (recommendation IN ('recommend', 'reject', 'request_clarification')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Vendor Code Sequences Table & Stored Procedure
CREATE TABLE IF NOT EXISTS vendor_code_sequences (
    category_code TEXT NOT NULL,
    sequence_year TEXT NOT NULL,
    last_value INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (category_code, sequence_year)
);

CREATE OR REPLACE FUNCTION generate_vendor_code(p_vendor_id UUID, p_category_code TEXT)
RETURNS TEXT AS $$
DECLARE
    v_prefix TEXT;
    v_year TEXT;
    v_seq INTEGER;
    v_code TEXT;
    v_l3_status TEXT;
BEGIN
    -- Verify L3 is approved before generating code
    SELECT l3_status::TEXT INTO v_l3_status 
    FROM vendor_approvals_l1_l2_l3 
    WHERE vendor_id = p_vendor_id;

    IF v_l3_status IS NULL OR v_l3_status != 'Approved' THEN
        RAISE EXCEPTION 'Vendor code can only be generated after L3 Management Approval';
    END IF;

    v_year := TO_CHAR(NOW(), 'YYYY');
    
    SELECT prefix INTO v_prefix 
    FROM vendor_categories_def 
    WHERE code::TEXT = p_category_code;
    
    IF v_prefix IS NULL THEN
        v_prefix := 'VND-' || UPPER(p_category_code);
    END IF;

    INSERT INTO vendor_code_sequences (category_code, sequence_year, last_value)
    VALUES (p_category_code, v_year, 1)
    ON CONFLICT (category_code, sequence_year)
    DO UPDATE SET last_value = vendor_code_sequences.last_value + 1
    RETURNING last_value INTO v_seq;

    v_code := v_prefix || '-' || v_year || '-' || LPAD(v_seq::TEXT, 5, '0');

    UPDATE vendor_profiles 
    SET vendor_code = v_code, activated_at = NOW()
    WHERE id = p_vendor_id;

    RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Open Ticketing & Grievance System
ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS is_internal_note BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sla_due_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sla_status TEXT DEFAULT 'Within SLA' CHECK (sla_status IN ('Within SLA', 'SLA Approaching', 'SLA Breached')),
ADD COLUMN IF NOT EXISTS resolution_notes TEXT,
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS ticket_internal_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SLA Definitions & Tracking Table
CREATE TABLE IF NOT EXISTS sla_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module TEXT NOT NULL UNIQUE,
    target_hours INTEGER NOT NULL DEFAULT 48,
    warning_hours INTEGER NOT NULL DEFAULT 36,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO sla_definitions (module, target_hours, warning_hours) VALUES
('onboarding_l1', 24, 18),
('onboarding_l2', 48, 36),
('onboarding_l3', 24, 18),
('ticket_critical', 12, 8),
('ticket_general', 48, 36)
ON CONFLICT (module) DO NOTHING;

-- 9. Row Level Security Policies
ALTER TABLE vendor_categories_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_approvals_l1_l2_l3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_internal_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view vendor categories" ON vendor_categories_def
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Internal staff view all vendor approvals" ON vendor_approvals_l1_l2_l3
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM organization_members om JOIN vendor_profiles vp ON om.organization_id = vp.organization_id WHERE vp.id = vendor_id AND om.user_id = auth.uid())
        OR is_internal_employee(auth.uid())
    );

CREATE POLICY "Internal staff create/update vendor approvals" ON vendor_approvals_l1_l2_l3
    FOR ALL USING (is_internal_employee(auth.uid()));

CREATE POLICY "Internal staff access technical assessments" ON technical_assessments
    FOR ALL USING (is_internal_employee(auth.uid()));

CREATE POLICY "Internal staff access ticket internal notes" ON ticket_internal_notes
    FOR ALL USING (is_internal_employee(auth.uid()));
