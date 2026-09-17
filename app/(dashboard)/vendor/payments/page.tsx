'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/supabase/mockDb';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Download, CreditCard, ShieldCheck } from 'lucide-react';

export default function VendorPaymentsPage() {
  const payments = mockStore.payments;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Payment Settlements & Advice</h1>
        <p className="text-xs text-slate-500 mt-1">View processed bank payouts, TDS tax deductions, and download official payment advice notes.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Ref</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Gross Approved</TableHead>
                <TableHead>TDS Deducted</TableHead>
                <TableHead>Net Settled Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Payment Advice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-bold text-slate-800 dark:text-slate-200">{p.transaction_ref}</TableCell>
                  <TableCell className="font-bold text-sky-600">{p.invoice_number}</TableCell>
                  <TableCell className="text-xs font-semibold">{formatCurrency(p.approved_amount)}</TableCell>
                  <TableCell className="text-xs font-semibold text-amber-600">- {formatCurrency(p.tax_deducted)}</TableCell>
                  <TableCell className="font-bold text-emerald-600">{formatCurrency(p.net_payable_amount)}</TableCell>
                  <TableCell className="text-xs">{formatDate(p.payment_date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} type="payment" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => alert(`Downloading payment advice reference: ADVICE-${p.transaction_ref}.pdf`)}
                      className="text-xs font-semibold gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Advice
                    </Button>
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
