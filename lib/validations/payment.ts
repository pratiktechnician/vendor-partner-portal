import { z } from 'zod';

export const paymentRecordSchema = z.object({
  invoice_id: z.string().min(1, 'Invoice reference required'),
  approved_amount: z.number().gt(0, 'Approved amount must be positive'),
  deduction_amount: z.number().gte(0, 'Deduction amount cannot be negative').default(0),
  tds_percentage: z.number().gte(0).lte(100, 'TDS % must be between 0 and 100').default(10),
  payment_method: z.enum(['NEFT', 'RTGS', 'UPI', 'Wire', 'Cheque']),
  transaction_ref: z.string().min(3, 'Bank transaction reference number is required'),
  payment_batch_no: z.string().optional(),
  payment_date: z.string().min(10, 'Payment execution date is required'),
  remarks: z.string().optional(),
  payment_advice_path: z.string().optional(),
});

export type PaymentRecordInput = z.infer<typeof paymentRecordSchema>;
