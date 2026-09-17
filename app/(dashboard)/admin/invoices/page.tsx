'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/supabase/mockDb';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { exportToCsv } from '@/lib/utils/exportCsv';
import { Download, Search, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function InvoiceRegisterPage() {
  const [search, setSearch] = React.useState('');
  const invoices = mockStore.invoices;

  const filtered = invoices.filter(
    (i) =>
      i.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      i.organization_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.po_number?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const data = filtered.map((i) => ({
      InvoiceNumber: i.invoice_number,
      VendorName: i.organization_name || '',
      VendorCode: i.vendor_code || '',
      InvoiceDate: i.invoice_date,
      DueDate: i.due_date,
      PONumber: i.po_number || '',
      Subtotal: i.subtotal,
      TaxAmount: i.tax_amount,
      GrossAmount: i.gross_amount,
      Status: i.status,
    }));
    exportToCsv('Invoice_Register_Report', data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Invoice Register Master</h1>
          <p className="text-xs text-slate-500 mt-1">Complete repository of submitted, approved, and paid vendor invoices.</p>
        </div>
        <Button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 self-start">
          <Download className="w-4 h-4" /> Export CSV Register
        </Button>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search by invoice #, vendor, or PO..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Vendor & Code</TableHead>
                <TableHead>PO #</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Gross Total</TableHead>
                <TableHead>Current Step</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-bold text-sky-600">{inv.invoice_number}</TableCell>
                  <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                    {inv.organization_name}
                    <span className="block text-[11px] font-mono text-slate-400">{inv.vendor_code}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{inv.po_number || 'N/A'}</TableCell>
                  <TableCell className="text-xs">{formatDate(inv.invoice_date)}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(inv.gross_amount)}</TableCell>
                  <TableCell className="text-xs text-slate-500">{inv.current_step_name || 'Completed'}</TableCell>
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
