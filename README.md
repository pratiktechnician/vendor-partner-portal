# Enterprise Vendor & Customer Management Portal

A production-ready, highly secure, full-stack **Vendor and Customer Management Portal** built with **Next.js 15 (App Router, TypeScript)**, **Tailwind CSS**, **shadcn/ui**, **Zod**, **React Hook Form**, **Recharts**, and **Supabase** (Auth, PostgreSQL DB, Storage, RLS, Realtime).

---

## 🌟 Key Features

1. **Multi-Role RBAC & Row Level Security (RLS)**:
   - Enforces role-based permissions across 8 roles (`super_admin`, `vendor`, `customer`, `doc_verifier`, `procurement_officer`, `dept_approver`, `finance_officer`, `auditor`).
   - One-click Interactive Demo Role Switcher in header for easy verification.
2. **10-Step Vendor Registration & Customer Onboarding Wizards**:
   - Progressive step-by-step registration with statutory validations (PAN, GSTIN, MSME, Banking).
   - Generates unique Vendor Code (`VND-2026-XXXXX`) and Customer Code (`CST-2026-XXXXX`) upon approval.
3. **Manual Verification Workspace**:
   - Document inspection queue with versioning, expiry alerts, signed URL previews, and reviewer comments.
4. **Configurable Invoice Approval Engine**:
   - Amount-based multi-tier routing ($\le$ ₹50k, ₹50k–₹500k, $>$ ₹500k).
   - Real-time line items calculation and duplicate invoice detection.
5. **Finance Payment Tracking & Payout Advice**:
   - Approved amount, deduction recording, TDS tax calculations, transaction reference tracking, and advice download.
6. **Immutable Audit Trail & Analytics**:
   - Read-only audit log tracking every transaction and state change.
   - Executive Recharts analytics (invoice aging, turnaround SLAs, vendor category distribution).
   - Filtered CSV exports.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ and npm installed.

### 1. Installation & Environment Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Run Automated Test Suite

```bash
# Run unit & integration Jest test suites
npm test
```

### 3. Start Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Run DDL schema migration script:
   - File: [`supabase/migrations/20260831000000_initial_schema.sql`](file:///c:/Users/PRATIK/Documents/Antigravity/vendor%20management%20system/supabase/migrations/20260831000000_initial_schema.sql)
2. Run database seed data script:
   - File: [`supabase/seed.sql`](file:///c:/Users/PRATIK/Documents/Antigravity/vendor%20management%20system/supabase/seed.sql)

---

## 🌐 Vercel Deployment Instructions

1. Push code repository to GitHub/GitLab.
2. Import project in Vercel.
3. Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`).
4. Deploy application. Build command: `npm run build`.

---

## 📚 Documentation
- Admin Guide: [`docs/admin_user_guide.md`](file:///c:/Users/PRATIK/Documents/Antigravity/vendor%20management%20system/docs/admin_user_guide.md)
- Vendor Quick-Start: [`docs/vendor_quickstart.md`](file:///c:/Users/PRATIK/Documents/Antigravity/vendor%20management%20system/docs/vendor_quickstart.md)
- Customer Quick-Start: [`docs/customer_quickstart.md`](file:///c:/Users/PRATIK/Documents/Antigravity/vendor%20management%20system/docs/customer_quickstart.md)
- Security & Assumptions: [`docs/security_and_assumptions.md`](file:///c:/Users/PRATIK/Documents/Antigravity/vendor%20management%20system/docs/security_and_assumptions.md)
