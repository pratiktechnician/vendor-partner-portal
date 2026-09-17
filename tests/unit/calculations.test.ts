import { calculateNetPayable } from '../../lib/services/paymentService';
import { detectDuplicateInvoice } from '../../lib/services/workflowEngine';
import { Invoice } from '../../types';

describe('Financial Calculations & Duplicate Logic Unit Tests', () => {
  test('calculateNetPayable calculates approved amount minus deductions and TDS correctly', () => {
    const result = calculateNetPayable({
      approved_amount: 100000,
      deduction_amount: 5000,
      tds_percentage: 10,
    });

    // Taxable base = 100000 - 5000 = 95000
    // TDS 10% = 9500
    // Net Payable = 100000 - 5000 - 9500 = 85500
    expect(result.approved_amount).toBe(100000);
    expect(result.deduction_amount).toBe(5000);
    expect(result.tax_deducted).toBe(9500);
    expect(result.net_payable_amount).toBe(85500);
  });

  test('detectDuplicateInvoice flags exact matching invoice number for same organization', () => {
    const mockInvoices: Invoice[] = [
      {
        id: 'inv-1',
        organization_id: 'org-vendor-01',
        invoice_number: 'INV-2026-0881',
        invoice_date: '2026-08-01',
        due_date: '2026-08-31',
        currency: 'INR',
        subtotal: 1000,
        tax_amount: 180,
        gross_amount: 1180,
        status: 'submitted',
        created_at: '2026-08-01T00:00:00Z',
      },
    ];

    const check = detectDuplicateInvoice(mockInvoices, 'INV-2026-0881', 'org-vendor-01');
    expect(check.isDuplicateNumber).toBe(true);
  });
});
