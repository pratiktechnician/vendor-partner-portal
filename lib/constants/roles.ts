import { UserRole } from '@/types';

export interface RoleConfig {
  name: UserRole;
  label: string;
  badgeColor: string;
  defaultPath: string;
  allowedPaths: string[];
}

export const ROLES_CONFIG: Record<UserRole, RoleConfig> = {
  super_admin: {
    name: 'super_admin',
    label: 'Super Administrator',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200',
    defaultPath: '/admin/dashboard',
    allowedPaths: ['/admin'],
  },
  vendor_admin: {
    name: 'vendor_admin',
    label: 'Vendor Operations Admin',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200',
    defaultPath: '/admin/vendors',
    allowedPaths: ['/admin'],
  },
  doc_verifier: {
    name: 'doc_verifier',
    label: 'L1 Document Verifier',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200',
    defaultPath: '/admin/document-reviews',
    allowedPaths: ['/admin/dashboard', '/admin/registrations', '/admin/document-reviews', '/admin/vendors'],
  },
  project_manager: {
    name: 'project_manager',
    label: 'L2 Technical Project Manager',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200',
    defaultPath: '/admin/approvals',
    allowedPaths: ['/admin/dashboard', '/admin/vendors', '/admin/approvals'],
  },
  management: {
    name: 'management',
    label: 'L3 Executive Management Approver',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200',
    defaultPath: '/admin/approvals',
    allowedPaths: ['/admin/dashboard', '/admin/vendors', '/admin/approvals', '/admin/reports'],
  },
  finance_officer: {
    name: 'finance_officer',
    label: 'Finance & Payout Lead',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200',
    defaultPath: '/admin/payments',
    allowedPaths: ['/admin/dashboard', '/admin/invoices', '/admin/approvals', '/admin/payments', '/admin/reports'],
  },
  commercial_officer: {
    name: 'commercial_officer',
    label: 'Commercial & WCC Officer',
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200',
    defaultPath: '/admin/approvals',
    allowedPaths: ['/admin/dashboard', '/admin/invoices', '/admin/approvals'],
  },
  ticket_support: {
    name: 'ticket_support',
    label: 'Partner Grievance Support Lead',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200',
    defaultPath: '/admin/tickets',
    allowedPaths: ['/admin/dashboard', '/admin/tickets', '/admin/vendors'],
  },
  auditor: {
    name: 'auditor',
    label: 'Compliance Auditor',
    badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200',
    defaultPath: '/admin/reports',
    allowedPaths: ['/admin/dashboard', '/admin/reports', '/admin/audit-logs'],
  },
  vendor: {
    name: 'vendor',
    label: 'Vendor Partner (External)',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200',
    defaultPath: '/vendor/dashboard',
    allowedPaths: ['/vendor'],
  },
  customer: {
    name: 'customer',
    label: 'Customer Client (External)',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200',
    defaultPath: '/customer/dashboard',
    allowedPaths: ['/customer'],
  },
};
