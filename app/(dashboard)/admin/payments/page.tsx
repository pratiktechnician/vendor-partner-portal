'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { PaymentRecordModal } from '@/components/payment/PaymentRecordModal';
import { mockStore } from '@/lib/supabase/mockDb';
import { Invoice, PaymentRecord } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { exportToCsv } from '@/lib/utils/exportCsv';
import { CreditCard, Download, CheckCircle, FileText } from 'lucide-react';

export default function PaymentProcessingPage() {
  const [invoices, setInvoices] = React.useState<Invoice[]>(mockStore.invoices);
  const [payments, setPayments] = React.useState<PaymentRecord[]>(mockStore.payments);
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenPaymentModal = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = (payment: PaymentRecord) => {
    setPayments((prev) => [payment, ...prev]);
    mockStore.payments.unshift(payment);

    // Update invoice status to paid
    setInvoices((prev) =>
      prev.map((i) => (i.id === payment.invoice_id ? { ...i, status: 'paid' as const, current_step_name: 'Payment Completed' } : i))
    );

    mockStore.logAudit('PAYMENT_RECORDED', 'payment', payment.id, null, payment);
    alert(`Payment recorded successfully! Reference: ${payment.transaction_ref}`);
  };

  const handleExportPayments = () => {
    const data = payments.map((p) => ({
      PaymentID: p.id,
      InvoiceNumber: p.invoice_number || '',
      VendorName: p.vendor_name || '',
      ApprovedAmount: p.approved_amount,
      Deductions: p.deduction_amount,
      TDSTaxDeducted: p.tax_deducted,
      NetPayable: p.net_payable_amount,
      BatchNo: p.payment_batch_no || '',
      Method: p.payment_method,
      TransactionRef: p.transaction_ref,
      PaymentDate: p.payment_date,
      Status: p.status,
    }));
    exportToCsv('Finance_Payment_Register', data);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Finance Payment Processing & Audit</h1>
          <p className="text-xs text-slate-500 mt-1">Record payouts, TDS deductions, transaction references, and payment advice docs.</p>
        </div>
        <Button onClick={handleExportPayments} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 self-start">
          <Download className="w-4 h-4" /> Export Payment Register
        </Button>
      </div>

      {/* Invoices Ready for Payment Queue */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Approved Invoices Awaiting Payment Settlement</CardTitle>
          <CardDescription>Invoices that have completed multi-tier workflow approvals</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Approved Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-bold text-sky-600">{inv.invoice_number}</TableCell>
                  <TableCell className="font-bold text-slate-900 dark:text-slate-100">{inv.organization_name}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(inv.gross_amount)}</TableCell>
                  <TableCell className="text-xs">{formatDate(inv.due_date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={inv.status} type="invoice" />
                  </TableCell>
                  <TableCell className="text-right">
                    {inv.status !== 'paid' ? (
                      <Button
                        size="sm"
                        onClick={() => handleOpenPaymentModal(inv)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Record Payment
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Paid & Settled
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Processed Payments Table */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Completed Payment History</CardTitle>
          <CardDescription>Audited bank transaction reference log</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Ref</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Net Payable</TableHead>
                <TableHead>Method & Batch</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-bold text-slate-800 dark:text-slate-200">{p.transaction_ref}</TableCell>
                  <TableCell className="font-bold text-sky-600">{p.invoice_number}</TableCell>
                  <TableCell className="font-medium text-xs">{p.vendor_name}</TableCell>
                  <TableCell className="font-bold text-emerald-600">{formatCurrency(p.net_payable_amount)}</TableCell>
                  <TableCell className="text-xs font-mono">{p.payment_method} ({p.payment_batch_no})</TableCell>
                  <TableCell className="text-xs">{formatDate(p.payment_date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} type="payment" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaymentRecordModal
        invoice={selectedInvoice}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
