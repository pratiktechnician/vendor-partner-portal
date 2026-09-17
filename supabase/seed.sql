-- ====================================================================
-- SEED DATA FOR VENDOR & CUSTOMER MANAGEMENT PORTAL
-- ====================================================================

-- 1. Insert Standard Roles
INSERT INTO roles (id, name, display_name, description) VALUES
('00000000-0000-0000-0000-000000000001', 'super_admin', 'Super Administrator', 'Full system configuration, security & operational access'),
('00000000-0000-0000-0000-000000000002', 'vendor', 'Vendor Representative', 'Submit vendor registration, mandatory compliance docs & invoices'),
('00000000-0000-0000-0000-000000000003', 'customer', 'Customer Representative', 'Submit customer onboarding details & compliance docs'),
('00000000-0000-0000-0000-000000000004', 'doc_verifier', 'Document Verification Officer', 'Review, verify & approve/reject organization registration documents'),
('00000000-0000-0000-0000-000000000005', 'procurement_officer', 'Procurement Officer', 'Review vendor business profile, PO details & onboarding approval'),
('00000000-0000-0000-0000-000000000006', 'dept_approver', 'Department Approver', 'Verify material/service delivery & approve department invoices'),
('00000000-0000-0000-0000-000000000007', 'finance_officer', 'Finance Officer', 'Perform financial invoice audit, tax/bank verification & record payments'),
('00000000-0000-0000-0000-000000000008', 'auditor', 'System Auditor / Viewer', 'Read-only compliance monitoring & reporting analytics')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Standard Departments
INSERT INTO departments (id, name, code) VALUES
('10000000-0000-0000-0000-000000000001', 'Information Technology', 'IT'),
('10000000-0000-0000-0000-000000000002', 'Operations & Logistics', 'OPS'),
('10000000-0000-0000-0000-000000000003', 'Finance & Accounting', 'FIN'),
('10000000-0000-0000-0000-000000000004', 'Human Resources', 'HR'),
('10000000-0000-0000-0000-000000000005', 'Procurement & Legal', 'PROC')
ON CONFLICT (code) DO NOTHING;

-- 3. Insert Business Categories
INSERT INTO business_categories (id, name, code, description) VALUES
('20000000-0000-0000-0000-000000000001', 'Software Services & SaaS', 'CAT-IT-01', 'Software development, cloud infrastructure & IT support'),
('20000000-0000-0000-0000-000000000002', 'Office Supplies & Hardware', 'CAT-OFF-01', 'Stationery, computers & office furniture'),
('20000000-0000-0000-0000-000000000003', 'Logistics & Freight Services', 'CAT-LOG-01', 'Warehousing, transportation & supply chain'),
('20000000-0000-0000-0000-000000000004', 'Legal & Professional Consulting', 'CAT-CON-01', 'Audit, legal advisory & corporate consulting')
ON CONFLICT (code) DO NOTHING;

-- 4. Document Requirements
INSERT INTO document_requirements (id, target_type, document_type, title, description, is_mandatory, validity_days) VALUES
('30000000-0000-0000-0000-000000000001', 'vendor', 'inc_cert', 'Certificate of Incorporation', 'Official corporate registration proof', true, NULL),
('30000000-0000-0000-0000-000000000002', 'vendor', 'pan_card', 'PAN Card Copy', 'Permanent Account Number proof', true, NULL),
('30000000-0000-0000-0000-000000000003', 'vendor', 'gst_cert', 'GST Registration Certificate', 'Goods & Services Tax registration proof', true, 365),
('30000000-0000-0000-0000-000000000004', 'vendor', 'bank_proof', 'Cancelled Cheque or Bank Statement', 'Proof of bank account details for payouts', true, NULL),
('30000000-0000-0000-0000-000000000005', 'customer', 'customer_agreement', 'Signed Service Agreement', 'Master services or billing agreement', true, 365)
ON CONFLICT DO NOTHING;

-- 5. Configurable Approval Workflows
INSERT INTO approval_workflows (id, name, min_amount, max_amount, is_active) VALUES
('40000000-0000-0000-0000-000000000001', 'Standard Invoice Workflow (Up to 50k)', 0.00, 50000.00, true),
('40000000-0000-0000-0000-000000000002', 'Mid-Tier Invoice Workflow (50k - 500k)', 50000.01, 500000.00, true),
('40000000-0000-0000-0000-000000000003', 'High-Value Invoice Workflow (Above 500k)', 500000.01, NULL, true)
ON CONFLICT DO NOTHING;

-- Workflow Steps
INSERT INTO approval_workflow_steps (id, workflow_id, step_order, step_name, required_role, is_department_specific) VALUES
-- Up to 50k
(uuid_generate_v4(), '40000000-0000-0000-0000-000000000001', 1, 'Department Verification', 'dept_approver', true),
(uuid_generate_v4(), '40000000-0000-0000-0000-000000000001', 2, 'Finance Audit & Payment Scheduling', 'finance_officer', false),
-- 50k to 500k
(uuid_generate_v4(), '40000000-0000-0000-0000-000000000002', 1, 'Department Head Approval', 'dept_approver', true),
(uuid_generate_v4(), '40000000-0000-0000-0000-000000000002', 2, 'Procurement Audit', 'procurement_officer', false),
(uuid_generate_v4(), '40000000-0000-0000-0000-000000000002', 3, 'Finance Audit & Payout Approval', 'finance_officer', false),
-- Above 500k
(uuid_generate_v4(), '40000000-0000-0000-0000-000000000003', 1, 'Department Head Approval', 'dept_approver', true),
(uuid_generate_v4(), '40000000-0000-0000-0000-000000000003', 2, 'Procurement Verification', 'procurement_officer', false),
(uuid_generate_v4(), '40000000-0000-0000-0000-000000000003', 3, 'Finance Head Audit', 'finance_officer', false),
(uuid_generate_v4(), '40000000-0000-0000-0000-000000000003', 4, 'Executive Signatory Approval', 'super_admin', false)
ON CONFLICT DO NOTHING;

-- 6. System Settings Default
INSERT INTO system_settings (key, value, description) VALUES
('company_info', '{"name": "Acme Global Enterprise Inc.", "email": "billing@acmeglobal.com", "currency": "INR"}'::jsonb, 'Global company details'),
('registration_rules', '{"auto_approve_risk_low": false, "require_bank_verification": true}'::jsonb, 'Rules for vendor & customer registration'),
('invoice_rules', '{"duplicate_check_days": 90, "max_attachment_mb": 15}'::jsonb, 'Rules for invoice validation')
ON CONFLICT (key) DO NOTHING;
