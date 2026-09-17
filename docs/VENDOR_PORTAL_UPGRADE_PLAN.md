# VENDOR PORTAL UPGRADE PLAN & ARCHITECTURE SPECIFICATION

## 1. Executive Summary

This document specifies the upgrade plan for transforming the existing Vendor & Customer Management Portal into a complete **Enterprise Vendor Management & Partner Onboarding Platform**.

The upgraded portal provides end-to-end governance over vendor onboarding, multi-category workflow routing, document compliance verification, 3-tier L1/L2/L3 approval gating, secure server-side vendor code generation, open ticketing/grievance management, SLA tracking, rules-based risk indicators, and real-time financial tracking.

---

## 2. Existing Architecture Analysis

### Current Tech Stack
- **Frontend Framework**: Next.js 16 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS, Lucide Icons, Glassmorphism & WebGL canvas elements
- **State & Form Management**: React Hook Form, Zod 4 schemas, stateful mock store (`lib/supabase/mockDb.ts`) with live Supabase client binding
- **Database & Services**: Supabase (PostgreSQL, Row Level Security, Auth, Storage)
- **Visuals & Charts**: Three.js (3D WebGL background & 3D tilt cards), Recharts (Executive Analytics)
- **Testing**: Jest unit & integration test suite

### Existing Strengths to Retain
- 29 normalized PostgreSQL tables with initial RLS policies.
- Clean component directory separation (`components/shared`, `components/vendor`, `components/invoice`, `components/payment`, `components/analytics`).
- Role-based route structure (`app/(dashboard)/admin`, `app/(dashboard)/vendor`, `app/(dashboard)/customer`).
- Masking helper functions (`XXXX-XXXX-1234`) for sensitive bank details.

### Areas Requiring Refactoring & Upgrades
1. **Vendor Onboarding Flow**: Expand from generic forms into a premium 8-step wizard with real-time percentage completion calculation, save-as-draft capability, and category selection.
2. **Vendor Categories**: Currently monolithic. Must support 3 distinct categories (**Cash Vendor**, **WCC Partner**, **Back-to-Back Partner**) with dynamic fields, mandatory documents, commercial rules, and payment workflows.
3. **3-Tier Approval Workflow (L1 -> L2 -> L3)**: Currently simple single-stage invoice workflows. Must implement sequential vendor onboarding approval gating:
   - **L1**: Document Verification (Legal, Banking, Mandatory Docs)
   - **L2**: Technical Assessment (Structured criteria for capability, manpower, reach, safety)
   - **L3**: Final Management Approval (Executive summary, risk indicators, final sign-off)
4. **Vendor Code Generation**: Must be executed via a database-level PL/pgSQL function (`generate_vendor_code`) triggered only upon L3 Final Management Approval with unique category prefix (`VND-CASH-2026-00001`, `VND-WCC-2026-00002`, `VND-B2B-2026-00003`).
5. **Open Ticketing & Grievance System**: Expand basic query table into a full ticket desk (`TKT-2026-XXXXXX`) with conversation threads, internal notes, vendor replies, priority SLAs, escalation states, and reopen functionality.
6. **SLA Engine & Command Center**: Implement SLA tracking across L1/L2/L3 approvals, tickets, and document reviews with "Within SLA", "SLA Approaching", and "SLA Breached" visual indicators and TAT metrics.
7. **Rules-Based Risk Indicator**: Implement an explainable risk scoring system (Low, Medium, High) driven by missing documents, expired certificates, SLA breaches, and open tickets.
8. **Vendor 360° Profile & Graphical Workflow Visualizer**: Interactive 13-tab profile with graphical stage pipeline (Registration -> L1 -> L2 -> L3 -> Active).

---

## 3. Database & Schema Expansion Plan

The database migration `supabase/migrations/20260917000000_vendor_platform_upgrade.sql` expands the PostgreSQL schema with the following additions:

```
+-----------------------------------------------------------------------------------+
|                            NEW & UPDATED SCHEMA TABLES                            |
+-----------------------------------------------------------------------------------+
| 1. vendor_categories_def       | Defines Cash, WCC, B2B vendor categories         |
| 2. category_document_rules     | Category-specific mandatory document rules       |
| 3. payment_workflows_def       | Category-specific payment workflow definitions   |
| 4. payment_workflow_stages     | Stages, sequences, SLAs & responsible roles       |
| 5. technical_assessments       | L2 Technical evaluations & criteria scores        |
| 6. vendor_approvals_l1_l2_l3   | L1 (Doc), L2 (Tech), L3 (Mgmt) state tracking    |
| 7. vendor_code_sequences       | Unique transactional code sequence generator     |
| 8. tickets & ticket_messages   | Ticket desk with SLA, priority, & threads        |
| 9. ticket_internal_notes       | Internal staff notes hidden from vendors         |
| 10. sla_definitions & tracking | Global & stage-specific SLA countdowns            |
| 11. vendor_risk_indicators     | Explainable risk signal rules & indicators       |
+-----------------------------------------------------------------------------------+
```

### Server-Side PL/pgSQL Function: `generate_vendor_code`
```sql
CREATE OR REPLACE FUNCTION generate_vendor_code(p_vendor_id UUID, p_category_code TEXT)
RETURNS TEXT AS $$
DECLARE
    v_prefix TEXT;
    v_year TEXT;
    v_seq INTEGER;
    v_code TEXT;
BEGIN
    -- Verify L1, L2, L3 are approved before generating code
    IF NOT EXISTS (
        SELECT 1 FROM vendor_approvals_l1_l2_l3 
        WHERE vendor_id = p_vendor_id AND l3_status = 'L3 Approved'
    ) THEN
        RAISE EXCEPTION 'Vendor code can only be generated after L3 Management Approval';
    END IF;

    v_year := TO_CHAR(NOW(), 'YYYY');
    v_prefix := 'VND-' || UPPER(p_category_code) || '-' || v_year || '-';

    INSERT INTO vendor_code_sequences (category_code, sequence_year, last_value)
    VALUES (p_category_code, v_year, 1)
    ON CONFLICT (category_code, sequence_year)
    DO UPDATE SET last_value = vendor_code_sequences.last_value + 1
    RETURNING last_value INTO v_seq;

    v_code := v_prefix || LPAD(v_seq::TEXT, 5, '0');

    UPDATE vendor_profiles 
    SET vendor_code = v_code, activated_at = NOW()
    WHERE id = p_vendor_id;

    RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4. Role-Based Access Control (RBAC) Matrix

| Portal Role | Category | Core Responsibilities | Scope Restrictions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Internal | Full platform governance, user management, workflow & SLA config | Unrestricted |
| **Vendor Admin** | Internal | Supervise vendor onboarding, master data, activation status | Internal Ops view |
| **L1 Doc Verifier** | Internal | L1 Document verification, legal & bank check, correction requests | L1 Queue & Docs |
| **Project Manager (L2)** | Internal | L2 Technical capability assessment, resource & safety evaluation | L2 Queue & Technicals |
| **Management (L3)** | Internal | L3 Executive final approval, risk review, vendor code authorization | L3 Queue & Master |
| **Finance Officer** | Internal | Payment processing, TDS deductions, penalty logging, remittance | Commercial & Invoices |
| **Commercial Officer** | Internal | Milestone validation, WCC/Back-to-Back commercial clearance | Commercial & Contracts |
| **Ticket Support** | Internal | Grievance resolution, SLA management, vendor communication | Support Tickets |
| **Compliance Auditor**| Internal | Read-only audit trail inspection, compliance reporting | Read-only |
| **Vendor User** | External | 8-step registration, doc upload, invoice & ticket submission | Own Vendor Data Only |

---

## 5. Sequential 3-Tier Approval Workflow Logic

```
   [ Vendor Submits 8-Step Registration ]
                     │
                     ▼
       ┌───────────────────────────┐
       │   L1: Document Review     │ ◄── Client Verification / Vendor Ops
       │  (Legal, Bank, Mand. Docs)│
       └─────────────┬─────────────┘
                     │ L1 Approved
                     ▼
       ┌───────────────────────────┐
       │  L2: Technical Assessment │ ◄── Project Manager / Technical Lead
       │  (8 Structured Criteria)  │
       └─────────────┬─────────────┘
                     │ L2 Recommended
                     ▼
       ┌───────────────────────────┐
       │ L3: Executive Management  │ ◄── Management / Authorized Approver
       │   (Risk & Summary Review) │
       └─────────────┬─────────────┘
                     │ L3 Approved
                     ▼
       ┌───────────────────────────┐
       │  Database Transactional   │ ──► Generates VND-{CAT}-YYYY-XXXXX
       │   Vendor Code Generation  │ ──► Activates Vendor Profile & Assigns
       └───────────────────────────┘     Category Payment Workflow
```

---

## 6. Category-Specific Payment Workflows

1. **CASH VENDOR WORKFLOW**:
   `Work Completion` ──► `Verification` ──► `Invoice Submission` ──► `Invoice Validation` ──► `Payment Processing` ──► `Payment Completed`

2. **WCC PARTNER WORKFLOW**:
   `Work Order` ──► `Milestone Completion` ──► `WCC Submission` ──► `WCC Verification` ──► `Invoice Submission` ──► `Finance Review` ──► `Payment`

3. **BACK-TO-BACK PARTNER WORKFLOW**:
   `Customer Milestone` ──► `Partner Milestone Validation` ──► `Customer Acceptance` ──► `Vendor Invoice` ──► `Commercial Validation` ──► `Payment Eligibility` ──► `Payment`

---

## 7. Security & Compliance Architecture

- **Database Tenant Isolation**: Row Level Security (RLS) policies on `organizations`, `documents`, `invoices`, `tickets`, `bank_accounts`, `vendor_approvals_l1_l2_l3`.
- **Sensitive Data Masking**: Bank account numbers encrypted at rest (`bank_accounts.account_number_encrypted`) and masked (`XXXX-XXXX-1234`) across all non-finance screens.
- **Service Role Key Isolation**: `SUPABASE_SERVICE_ROLE_KEY` used strictly in server-side API routes (`app/api/`), never exposed to browser context.
- **Immutable Audit Trail**: All L1/L2/L3 actions, document status changes, ticket replies, and vendor code generations logged to `audit_logs` with actor ID, IP address, timestamp, and metadata.

---

## 8. Deployment & CI/CD Architecture

- **Source Control**: GitHub repository with branch protection rules.
- **Frontend Hosting**: Vercel (Next.js 16 Server Components & Edge API Routes).
- **Backend Services**: Supabase Cloud (PostgreSQL 15, GoTrue Auth, Encrypted Storage Buckets, Realtime WebSockets).
