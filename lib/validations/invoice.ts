import { z } from 'zod';

export const invoiceLineItemSchema = z.object({
  description: z.string().min(3, 'Line item description is required'),
  quantity: z.number().gt(0, 'Quantity must be greater than zero'),
  unit: z.string().default('nos'),
  unit_rate: z.number().gte(0, 'Unit rate cannot be negative'),
  tax_rate: z.number().gte(0).lte(100, 'Tax rate must be between 0% and 100%'),
  tax_amount: z.number(),
  line_total: z.number(),
});

export const invoiceSubmissionSchema = z.object({
  invoice_number: z.string().min(2, 'Invoice number is required'),
  invoice_date: z.string().min(10, 'Valid invoice date required'),
  due_date: z.string().min(10, 'Valid due date required'),
  po_number: z.string().optional(),
  work_order_no: z.string().optional(),
  department_id: z.string().min(1, 'Please select the target department'),
  currency: z.string().default('INR'),
  remarks: z.string().optional(),

  line_items: z.array(invoiceLineItemSchema).min(1, 'At least one line item is required'),
  
  invoice_pdf_path: z.string().min(1, 'Invoice PDF attachment is required'),
  supporting_doc_paths: z.array(z.string()).optional(),
});

export type InvoiceLineItemInput = z.infer<typeof invoiceLineItemSchema>;
export type InvoiceSubmissionInput = z.infer<typeof invoiceSubmissionSchema>;
