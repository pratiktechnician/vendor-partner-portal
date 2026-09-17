'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/supabase/mockDb';
import { exportToCsv } from '@/lib/utils/exportCsv';
import { Download, FileText, Users, CreditCard, History, BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    {
      title: 'Vendor Master Directory',
      description: 'Complete database of active vendors, tax numbers, contact details, and statutory categories.',
      icon: Users,
      action: () => {
        const rows = mockStore.organizations
          .filter((o) => o.entity_type === 'vendor')
          .map((v) => ({
            VendorCode: v.vendor_code || '',
            LegalName: v.legal_name,
            TradingName: v.trading_name || '',
            RegNumber: v.registration_number || '',
            PAN: v.pan || '',
            GSTIN: v.gstin || '',
            Status: v.status,
            RiskLevel: v.risk_level,
          }));
        exportToCsv('Vendor_Master_Report', rows);
      },
    },
    {
      title: 'Invoice Register & Workflow Aging',
      description: 'Submitted invoices, approval turnaround timestamps, department breakdown, and gross totals.',
      icon: FileText,
      action: () => {
        const rows = mockStore.invoices.map((inv) => ({
          InvoiceNumber: inv.invoice_number,
          VendorName: inv.organization_name,
          InvoiceDate: inv.invoice_date,
          DueDate: inv.due_date,
          GrossAmount: inv.gross_amount,
          Status: inv.status,
        }));
        exportToCsv('Invoice_Register_Report', rows);
      },
    },
    {
      title: 'Payment Settlement Register',
      description: 'Finance payment execution log, net payable math, TDS deductions, and transaction bank references.',
      icon: CreditCard,
      action: () => {
        const rows = mockStore.payments.map((p) => ({
          TransactionRef: p.transaction_ref,
          InvoiceNumber: p.invoice_number,
          VendorName: p.vendor_name,
          ApprovedAmount: p.approved_amount,
          TDSDeducted: p.tax_deducted,
          NetPayable: p.net_payable_amount,
          BatchNo: p.payment_batch_no,
          PaymentDate: p.payment_date,
        }));
        exportToCsv('Payment_Settlement_Report', rows);
      },
    },
    {
      title: 'Compliance Audit Trail Log',
      description: 'Immutable system activity stream for external compliance auditors.',
      icon: History,
      action: () => {
        const rows = mockStore.auditLogs.map((a) => ({
          AuditID: a.id,
          Action: a.action,
          ActorName: a.actor_name,
          ActorRole: a.actor_role,
          EntityType: a.entity_type,
          Timestamp: a.created_at,
        }));
        exportToCsv('System_Audit_Logs_Report', rows);
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Compliance & Financial Reports</h1>
        <p className="text-xs text-slate-500 mt-1">Export role-permission controlled CSV reports for statutory audit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r, i) => {
          const Icon = r.icon;
          return (
            <Card key={i} className="border-slate-200 dark:border-slate-800">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">{r.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">{r.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button onClick={r.action} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-2">
                  <Download className="w-4 h-4" /> Download CSV Export
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
