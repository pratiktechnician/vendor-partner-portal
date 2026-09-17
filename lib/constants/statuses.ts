import { EntityStatus, DocumentStatus, InvoiceStatus, PaymentStatus, TicketStatus } from '@/types';

export const ENTITY_STATUS_CONFIG: Record<EntityStatus, { label: string; variant: string }> = {
  draft: { label: 'Draft', variant: 'bg-slate-100 text-slate-700 border-slate-300' },
  submitted: { label: 'Submitted', variant: 'bg-blue-100 text-blue-800 border-blue-300' },
  under_review: { label: 'Under Review', variant: 'bg-amber-100 text-amber-800 border-amber-300' },
  correction_required: { label: 'Correction Required', variant: 'bg-orange-100 text-orange-800 border-orange-300' },
  l1_approved: { label: 'L1 Approved', variant: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  l2_recommended: { label: 'L2 Recommended', variant: 'bg-purple-100 text-purple-800 border-purple-300' },
  approved: { label: 'Active / Approved', variant: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  rejected: { label: 'Rejected', variant: 'bg-rose-100 text-rose-800 border-rose-300' },
  suspended: { label: 'Suspended', variant: 'bg-red-100 text-red-800 border-red-300' },
  expired: { label: 'Expired', variant: 'bg-gray-100 text-gray-700 border-gray-300' },
};

export const DOCUMENT_STATUS_CONFIG: Record<DocumentStatus, { label: string; variant: string }> = {
  missing: { label: 'Missing', variant: 'bg-rose-100 text-rose-800 border-rose-300' },
  uploaded: { label: 'Uploaded', variant: 'bg-blue-100 text-blue-700 border-blue-200' },
  under_review: { label: 'Under Review', variant: 'bg-amber-100 text-amber-700 border-amber-200' },
  verified: { label: 'Verified & Approved', variant: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  rejected: { label: 'Rejected', variant: 'bg-rose-100 text-rose-800 border-rose-300' },
  correction_required: { label: 'Correction Needed', variant: 'bg-orange-100 text-orange-800 border-orange-300' },
  expired: { label: 'Expired', variant: 'bg-red-100 text-red-700 border-red-200' },
  expiring_soon: { label: 'Expiring Soon', variant: 'bg-amber-100 text-amber-800 border-amber-300' },
};

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { label: string; variant: string }> = {
  draft: { label: 'Draft', variant: 'bg-slate-100 text-slate-600 border-slate-200' },
  submitted: { label: 'Submitted', variant: 'bg-sky-100 text-sky-800 border-sky-300' },
  initial_validation: { label: 'Validation Pending', variant: 'bg-amber-100 text-amber-800 border-amber-300' },
  correction_required: { label: 'Returned for Correction', variant: 'bg-orange-100 text-orange-800 border-orange-300' },
  dept_approval_pending: { label: 'Dept Review Pending', variant: 'bg-blue-100 text-blue-800 border-blue-300' },
  procurement_approval_pending: { label: 'Procurement Review', variant: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  finance_approval_pending: { label: 'Finance Review', variant: 'bg-purple-100 text-purple-800 border-purple-300' },
  approved_for_payment: { label: 'Approved for Payment', variant: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  on_hold: { label: 'On Hold', variant: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  partially_paid: { label: 'Partially Paid', variant: 'bg-teal-100 text-teal-800 border-teal-300' },
  paid: { label: 'Payment Completed', variant: 'bg-green-100 text-green-800 border-green-300' },
  rejected: { label: 'Rejected', variant: 'bg-rose-100 text-rose-800 border-rose-300' },
  cancelled: { label: 'Cancelled', variant: 'bg-slate-200 text-slate-700 border-slate-300' },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; variant: string }> = {
  not_initiated: { label: 'Not Initiated', variant: 'bg-slate-100 text-slate-600 border-slate-200' },
  scheduled: { label: 'Scheduled', variant: 'bg-blue-100 text-blue-800 border-blue-300' },
  processing: { label: 'Processing', variant: 'bg-amber-100 text-amber-800 border-amber-300' },
  partially_paid: { label: 'Partially Paid', variant: 'bg-teal-100 text-teal-800 border-teal-300' },
  paid: { label: 'Paid', variant: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  failed: { label: 'Failed', variant: 'bg-rose-100 text-rose-800 border-rose-300' },
  reversed: { label: 'Reversed', variant: 'bg-purple-100 text-purple-800 border-purple-300' },
};
