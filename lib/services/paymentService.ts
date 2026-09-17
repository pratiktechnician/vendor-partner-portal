export interface PaymentCalculationInput {
  approved_amount: number;
  deduction_amount: number;
  tds_percentage: number;
}

export interface PaymentCalculationResult {
  approved_amount: number;
  deduction_amount: number;
  tax_deducted: number;
  net_payable_amount: number;
}

export function calculateNetPayable(input: PaymentCalculationInput): PaymentCalculationResult {
  const approved = Math.max(0, input.approved_amount || 0);
  const deductions = Math.max(0, input.deduction_amount || 0);
  const tdsPercent = Math.max(0, Math.min(100, input.tds_percentage || 0));

  const taxableBase = Math.max(0, approved - deductions);
  const tax_deducted = Math.round((taxableBase * (tdsPercent / 100)) * 100) / 100;
  const net_payable_amount = Math.round((approved - deductions - tax_deducted) * 100) / 100;

  return {
    approved_amount: approved,
    deduction_amount: deductions,
    tax_deducted,
    net_payable_amount,
  };
}

export function generatePaymentBatchNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BATCH-${dateStr}-${randomSuffix}`;
}
