'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceSubmissionSchema, InvoiceSubmissionInput } from '@/lib/validations/invoice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FileUploader } from '@/components/shared/FileUploader';
import { mockStore } from '@/lib/supabase/mockDb';
import { formatCurrency } from '@/lib/utils/formatters';
import { detectDuplicateInvoice, getWorkflowForAmount } from '@/lib/services/workflowEngine';
import { Plus, Trash2, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export function InvoiceForm() {
  const router = useRouter();
  const [duplicateWarning, setDuplicateWarning] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceSubmissionInput>({
    resolver: zodResolver(invoiceSubmissionSchema) as any,
    defaultValues: {
      invoice_number: '',
      invoice_date: new Date().toISOString().slice(0, 10),
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      po_number: '',
      work_order_no: '',
      department_id: '10000000-0000-0000-0000-000000000001',
      currency: 'INR',
      remarks: '',
      line_items: [
        {
          description: '',
          quantity: 1,
          unit: 'nos',
          unit_rate: 0,
          tax_rate: 18,
          tax_amount: 0,
          line_total: 0,
        },
      ],
      invoice_pdf_path: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'line_items',
  });

  const watchLineItems = watch('line_items');
  const watchInvNumber = watch('invoice_number');
  const watchPoNumber = watch('po_number');

  // Real-time server-calculated totals
  const totals = React.useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;

    watchLineItems?.forEach((item) => {
      const qty = Math.max(0, Number(item.quantity) || 0);
      const rate = Math.max(0, Number(item.unit_rate) || 0);
      const taxRate = Math.max(0, Number(item.tax_rate) || 0);

      const itemSubtotal = qty * rate;
      const itemTax = (itemSubtotal * taxRate) / 100;
      subtotal += itemSubtotal;
      totalTax += itemTax;
    });

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(totalTax * 100) / 100,
      grossAmount: Math.round((subtotal + totalTax) * 100) / 100,
    };
  }, [watchLineItems]);

  // Check duplicate invoice numbers or PO numbers in real-time
  React.useEffect(() => {
    if (watchInvNumber && watchInvNumber.length > 2) {
      const check = detectDuplicateInvoice(
        mockStore.invoices,
        watchInvNumber,
        'org-vendor-01',
        watchPoNumber,
        totals.grossAmount
      );
      if (check.isDuplicateNumber || check.isPotentialDuplicatePo) {
        setDuplicateWarning(check.message || null);
      } else {
        setDuplicateWarning(null);
      }
    }
  }, [watchInvNumber, watchPoNumber, totals.grossAmount]);

  const workflowInfo = getWorkflowForAmount(totals.grossAmount);

  const onSubmit = (data: InvoiceSubmissionInput) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newInvoice = {
        id: `inv-${Date.now()}`,
        organization_id: 'org-vendor-01',
        organization_name: 'Apex Tech Solutions Pvt Ltd',
        vendor_code: 'VND-2026-00101',
        invoice_number: data.invoice_number,
        invoice_date: data.invoice_date,
        due_date: data.due_date,
        po_number: data.po_number,
        department_id: data.department_id,
        department_name: 'Information Technology',
        currency: data.currency,
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        gross_amount: totals.grossAmount,
        status: 'dept_approval_pending' as const,
        remarks: data.remarks,
        created_at: new Date().toISOString(),
        current_step_name: workflowInfo.steps[0].step_name,
        pending_role: workflowInfo.steps[0].required_role,
        line_items: data.line_items.map((li, idx) => ({
          id: `li-${idx}`,
          description: li.description,
          quantity: li.quantity,
          unit: li.unit,
          unit_rate: li.unit_rate,
          tax_rate: li.tax_rate,
          tax_amount: (li.quantity * li.unit_rate * li.tax_rate) / 100,
          line_total: li.quantity * li.unit_rate * (1 + li.tax_rate / 100),
        })),
        documents: [
          { id: `doc-${Date.now()}`, doc_type: 'invoice_pdf', file_name: `${data.invoice_number}.pdf`, storage_path: data.invoice_pdf_path },
        ],
      };

      mockStore.invoices.unshift(newInvoice);
      mockStore.logAudit('INVOICE_SUBMITTED', 'invoice', newInvoice.id, null, newInvoice);

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto my-8 p-8 text-center bg-emerald-50/50 border-emerald-200">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
        <CardTitle className="text-xl">Invoice Submitted for Approval!</CardTitle>
        <CardDescription className="mt-2">
          Your invoice has been routed to the <strong>{workflowInfo.workflow_name}</strong> queue.
        </CardDescription>
        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={() => router.push('/vendor/invoices')} className="bg-sky-600">
            View All Invoices
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Submit Vendor Invoice</CardTitle>
            <CardDescription>Submit invoice and supporting completion documents for workflow approval.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {duplicateWarning && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-rose-800">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{duplicateWarning}</span>
              </div>
            )}

            {/* General Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Invoice Number *</label>
                <Input {...register('invoice_number')} placeholder="INV-2026-XXXX" />
                {errors.invoice_number && <p className="text-rose-500 text-xs mt-1">{errors.invoice_number.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Invoice Date *</label>
                <Input type="date" {...register('invoice_date')} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Due Date *</label>
                <Input type="date" {...register('due_date')} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Purchase Order (PO) No.</label>
                <Input {...register('po_number')} placeholder="PO-2026-XXXX" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Target Department *</label>
                <select
                  {...register('department_id')}
                  className="w-full h-10 px-3 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="10000000-0000-0000-0000-000000000001">Information Technology (IT)</option>
                  <option value="10000000-0000-0000-0000-000000000002">Operations & Logistics (OPS)</option>
                  <option value="10000000-0000-0000-0000-000000000003">Finance & Accounting (FIN)</option>
                  <option value="10000000-0000-0000-0000-000000000005">Procurement & Legal (PROC)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Currency</label>
                <Input {...register('currency')} value="INR" disabled />
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Invoice Line Items</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      description: '',
                      quantity: 1,
                      unit: 'nos',
                      unit_rate: 0,
                      tax_rate: 18,
                      tax_amount: 0,
                      line_total: 0,
                    })
                  }
                  className="gap-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Line Item
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="col-span-12 md:col-span-5">
                      <label className="block text-[11px] font-medium mb-1">Description *</label>
                      <Input {...register(`line_items.${index}.description` as const)} placeholder="Item or service description..." />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[11px] font-medium mb-1">Qty</label>
                      <Input type="number" step="any" {...register(`line_items.${index}.quantity` as const)} />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-[11px] font-medium mb-1">Unit Rate (₹)</label>
                      <Input type="number" step="any" {...register(`line_items.${index}.unit_rate` as const)} />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <label className="block text-[11px] font-medium mb-1">Tax (%)</label>
                      <Input type="number" step="any" {...register(`line_items.${index}.tax_rate` as const)} />
                    </div>
                    <div className="col-span-1 flex justify-end pb-1">
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations & Workflow Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div className="p-4 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 rounded-lg space-y-1 text-xs">
                <p className="font-bold text-sky-800 dark:text-sky-300">Approval Routing Workflow</p>
                <p><strong>Required Workflow:</strong> {workflowInfo.workflow_name}</p>
                <p><strong>Steps Sequence:</strong> {workflowInfo.steps.map((s) => s.step_name).join(' ➔ ')}</p>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-slate-800/60 rounded-lg space-y-2 text-sm text-right">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax Amount (GST):</span>
                  <span className="font-semibold">{formatCurrency(totals.taxAmount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-base font-bold text-sky-600">
                  <span>Gross Total Amount:</span>
                  <span>{formatCurrency(totals.grossAmount)}</span>
                </div>
              </div>
            </div>

            {/* Document Attachments */}
            <div className="space-y-2">
              <FileUploader
                label="Upload Signed Invoice PDF *"
                onUploadSuccess={(meta) => setValue('invoice_pdf_path', meta.path)}
              />
              {errors.invoice_pdf_path && <p className="text-rose-500 text-xs">{errors.invoice_pdf_path.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end p-4 border-t">
            <Button
              type="submit"
              disabled={isSubmitting || !!duplicateWarning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8"
            >
              {isSubmitting ? 'Submitting Invoice...' : 'Submit Invoice for Approval'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
