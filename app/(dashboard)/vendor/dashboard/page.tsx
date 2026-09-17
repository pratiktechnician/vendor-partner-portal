'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/supabase/mockDb';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Building, FileText, CheckCircle2, AlertTriangle, PlusCircle, CreditCard, FolderOpen } from 'lucide-react';

export default function VendorDashboardPage() {
  const vendorOrg = mockStore.organizations.find((o) => o.entity_type === 'vendor') || mockStore.organizations[0];
  const invoices = mockStore.invoices.filter((i) => i.organization_id === vendorOrg?.id);
  const documents = mockStore.documents.filter((d) => d.organization_id === vendorOrg?.id);

  const approvedDocsCount = documents.filter((d) => d.status === 'verified').length;
  const docCompleteness = documents.length > 0 ? Math.round((approvedDocsCount / documents.length) * 100) : 100;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
              {vendorOrg.vendor_code || 'VND-2026-00101'}
            </span>
            <StatusBadge status={vendorOrg.status} type="entity" />
          </div>
          <h1 className="text-2xl font-extrabold">{vendorOrg.legal_name}</h1>
          <p className="text-xs text-sky-200 mt-1">Vendor Partner Portal • GSTIN: {vendorOrg.gstin || '07AAACA1234F1Z5'}</p>
        </div>

        {vendorOrg.status === 'approved' && (
          <Link href="/vendor/invoices/new">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 shadow-md">
              <PlusCircle className="w-4 h-4" /> Submit Invoice
            </Button>
          </Link>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Document Completeness</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{docCompleteness}%</p>
              <p className="text-[11px] text-emerald-600 font-medium">{approvedDocsCount} of {documents.length} Docs Verified</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Submitted Invoices</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{invoices.length}</p>
              <p className="text-[11px] text-slate-400">Total submitted</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Settled Payouts</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(mockStore.payments.reduce((sum, p) => sum + p.net_payable_amount, 0))}
              </p>
              <p className="text-[11px] text-slate-400">Total processed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Track Table */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">My Submitted Invoices</CardTitle>
            <CardDescription>Real-time approval workflow and payment status tracking</CardDescription>
          </div>
          <Link href="/vendor/invoices">
            <Button variant="outline" size="sm" className="text-xs">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>PO #</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Gross Amount</TableHead>
                <TableHead>Workflow Progress</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-bold text-sky-600">{inv.invoice_number}</TableCell>
                  <TableCell className="font-mono text-xs">{inv.po_number || 'N/A'}</TableCell>
                  <TableCell className="text-xs">{formatDate(inv.invoice_date)}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(inv.gross_amount)}</TableCell>
                  <TableCell className="text-xs text-slate-500">{inv.current_step_name || 'Processing'}</TableCell>
                  <TableCell>
                    <StatusBadge status={inv.status} type="invoice" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
