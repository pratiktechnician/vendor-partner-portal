import { vendorRegistrationSchema } from '../../lib/validations/vendor';
import { invoiceSubmissionSchema } from '../../lib/validations/invoice';
import { paymentRecordSchema } from '../../lib/validations/payment';

describe('Validation Schemas Unit Tests', () => {
  test('Vendor Registration validation accepts complete input', () => {
    const validVendor = {
      legal_name: 'Apex Tech Solutions Pvt Ltd',
      trading_name: 'Apex Tech',
      organization_type: 'private_limited',
      registration_number: 'U72200DL2021PTC384721',
      year_established: 2021,
      website: 'https://apextech.com',
      nature_of_business: 'Cloud infrastructure & DevSecOps consulting',
      reg_street: 'Building 4, Cyber City',
      reg_city: 'Gurugram',
      reg_state: 'Haryana',
      reg_country: 'India',
      reg_postal_code: '122002',
      primary_contact_name: 'Rajesh Sharma',
      primary_contact_email: 'rajesh@apextech.com',
      primary_contact_phone: '9811223344',
      pan: 'ABCDE1234F',
      gstin: '07ABCDE1234F1Z5',
      msme_status: true,
      msme_category: 'small',
      bank_name: 'HDFC Bank',
      account_holder: 'Apex Tech Solutions Pvt Ltd',
      account_number: '998822334411',
      confirm_account_number: '998822334411',
      branch_name: 'Connaught Place Branch',
      ifsc_swift_code: 'HDFC0001234',
      payment_terms_days: 30,
      preferred_currency: 'INR',
      category: 'cash_vendor',
      declaration_accepted: true,
    };

    const result = vendorRegistrationSchema.safeParse(validVendor);
    expect(result.success).toBe(true);
  });

  test('Invoice Submission validation fails if no line items are provided', () => {
    const invalidInvoice = {
      invoice_number: 'INV-001',
      invoice_date: '2026-08-01',
      due_date: '2026-08-31',
      department_id: '10000000-0000-0000-0000-000000000001',
      currency: 'INR',
      line_items: [],
      invoice_pdf_path: 'uploads/inv.pdf',
    };

    const result = invoiceSubmissionSchema.safeParse(invalidInvoice);
    expect(result.success).toBe(false);
  });
});
