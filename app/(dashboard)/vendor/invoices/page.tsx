'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/supabase/mockDb';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { PlusCircle, FileText } from 'lucide-react';

export default function VendorInvoicesListPage() {
  const invoices = mockStore.invoices;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">My Invoices</h1>
          <p className="text-xs text-slate-500 mt-1">Track submitted invoices and approval state transitions.</p>
        </div>
        <Link href="/vendor/invoices/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-xs">
            <PlusCircle className="w-4 h-4" /> Submit New Invoice
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>PO Reference</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
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
                  <TableCell className="text-xs">{formatDate(inv.due_date)}</TableCell>
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
