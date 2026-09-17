'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentRecordSchema, PaymentRecordInput } from '@/lib/validations/payment';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUploader } from '@/components/shared/FileUploader';
import { Invoice } from '@/types';
import { calculateNetPayable, generatePaymentBatchNumber } from '@/lib/services/paymentService';
import { formatCurrency } from '@/lib/utils/formatters';

interface PaymentRecordModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (payment: any) => void;
}

export function PaymentRecordModal({
  invoice,
  isOpen,
  onClose,
  onPaymentSuccess,
}: PaymentRecordModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentRecordInput>({
    resolver: zodResolver(paymentRecordSchema) as any,
    defaultValues: {
      invoice_id: invoice?.id || '',
      approved_amount: invoice?.gross_amount || 0,
      deduction_amount: 0,
      tds_percentage: 10,
      payment_method: 'NEFT',
      transaction_ref: '',
      payment_batch_no: generatePaymentBatchNumber(),
      payment_date: new Date().toISOString().slice(0, 10),
      remarks: 'Payment settled via corporate banking',
    },
  });

  React.useEffect(() => {
    if (invoice) {
      setValue('invoice_id', invoice.id);
      setValue('approved_amount', invoice.gross_amount);
    }
  }, [invoice, setValue]);

  const approvedAmt = watch('approved_amount') || 0;
  const deductionAmt = watch('deduction_amount') || 0;
  const tdsPct = watch('tds_percentage') || 0;

  const calculations = React.useMemo(() => {
    return calculateNetPayable({
      approved_amount: approvedAmt,
      deduction_amount: deductionAmt,
      tds_percentage: tdsPct,
    });
  }, [approvedAmt, deductionAmt, tdsPct]);

  if (!invoice) return null;

  const onSubmit = (data: PaymentRecordInput) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const paymentRecord = {
        id: `pay-${Date.now()}`,
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number,
        vendor_name: invoice.organization_name,
        approved_amount: calculations.approved_amount,
        deduction_amount: calculations.deduction_amount,
        tax_deducted: calculations.tax_deducted,
        net_payable_amount: calculations.net_payable_amount,
        payment_batch_no: data.payment_batch_no,
        payment_method: data.payment_method,
        transaction_ref: data.transaction_ref,
        payment_date: data.payment_date,
        status: 'paid' as const,
        remarks: data.remarks,
      };

      setIsSubmitting(false);
      onPaymentSuccess(paymentRecord);
      onClose();
    }, 600);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Record Payment for ${invoice.invoice_number}`}
      description={`Vendor: ${invoice.organization_name} • Gross Invoice Total: ${formatCurrency(invoice.gross_amount)}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Approved Payout Amount (₹) *</label>
            <Input type="number" step="any" {...register('approved_amount')} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Deduction / Penalty Amount (₹)</label>
            <Input type="number" step="any" {...register('deduction_amount')} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">TDS Tax Rate (%) *</label>
            <Input type="number" step="any" {...register('tds_percentage')} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Payment Method *</label>
            <select
              {...register('payment_method')}
              className="w-full h-10 px-3 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="NEFT">NEFT Transfer</option>
              <option value="RTGS">RTGS Transfer</option>
              <option value="UPI">UPI Payment</option>
              <option value="Wire">Wire Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Bank Transaction Reference *</label>
            <Input {...register('transaction_ref')} placeholder="e.g. NEFT99182390123" />
            {errors.transaction_ref && <p className="text-rose-500 text-xs mt-1">{errors.transaction_ref.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Payment Execution Date *</label>
            <Input type="date" {...register('payment_date')} />
          </div>
        </div>

        {/* Calculation summary box */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-1 text-xs text-slate-800 dark:text-slate-200">
          <div className="flex justify-between">
            <span>Approved Amount:</span>
            <span className="font-semibold">{formatCurrency(calculations.approved_amount)}</span>
          </div>
          <div className="flex justify-between text-rose-600 dark:text-rose-400">
            <span>Less Deductions:</span>
            <span>- {formatCurrency(calculations.deduction_amount)}</span>
          </div>
          <div className="flex justify-between text-amber-600 dark:text-amber-400">
            <span>Less TDS Tax ({tdsPct}%):</span>
            <span>- {formatCurrency(calculations.tax_deducted)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t text-sm font-bold text-emerald-700 dark:text-emerald-300">
            <span>Net Payable Amount:</span>
            <span>{formatCurrency(calculations.net_payable_amount)}</span>
          </div>
        </div>

        <FileUploader label="Upload Payment Advice Document" onUploadSuccess={() => {}} />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            {isSubmitting ? 'Recording...' : 'Record Payment Completion'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
