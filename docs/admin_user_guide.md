# Admin User Guide

## Overview
The Executive Console (`/admin/dashboard`) provides complete operational control over vendor onboarding, document verification, multi-stage invoice approval routing, and finance payouts.

## Role Responsibilities

### 1. Document Verification Officer (`/admin/document-reviews`)
- Access document review queue.
- Click **Inspect Document** to preview uploaded files via secure signed URLs.
- Approve or reject individual documents. Mandatory comments are required when rejecting or requesting correction.

### 2. Procurement Officer (`/admin/registrations`)
- Review legal organization details, business categories, PAN/GSTIN validity.
- Click **Approve** to generate official Vendor Code (`VND-2026-XXXXX`).

### 3. Department Approver (`/admin/approvals`)
- Review invoices assigned to your department.
- Confirm service/goods receipt and execute step approval, return, or rejection.

### 4. Finance Officer (`/admin/payments`)
- Perform financial audit on approved invoices.
- Record payout amounts, penalty deductions, TDS tax deductions (10%), and bank transaction references.
- Upload payment advice notes.

### 5. Super Admin (`/admin/users`, `/admin/workflows`, `/admin/settings`)
- Manage internal employee accounts and assign RBAC roles.
- Configure amount-based approval thresholds dynamically.
- Monitor immutable audit log entries (`/admin/audit-logs`).
