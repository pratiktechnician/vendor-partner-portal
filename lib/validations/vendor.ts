import { z } from 'zod';

export const vendorRegistrationSchema = z.object({
  // Step 1: Organization Information
  legal_name: z.string().min(2, 'Legal organization name is required'),
  trading_name: z.string().optional(),
  organization_type: z.enum(['private_limited', 'public_limited', 'proprietorship', 'partnership', 'llp']),
  year_established: z.coerce.number().min(1800).max(new Date().getFullYear()),
  website: z.string().url().or(z.literal('')).optional(),
  nature_of_business: z.string().min(5, 'Nature of business description required'),

  // Step 2: Business & Legal Details
  registration_number: z.string().min(3, 'Incorporation/registration number required'),
  pan: z.string().min(5, 'Valid PAN number required'),
  gstin: z.string().min(5, 'Valid GSTIN required'),
  cin_number: z.string().optional(),
  msme_status: z.boolean().default(false),
  msme_category: z.enum(['micro', 'small', 'medium', 'none']).optional(),

  // Step 3: Contact & Address Information
  reg_street: z.string().min(3, 'Registered street address required'),
  reg_city: z.string().min(2, 'City required'),
  reg_state: z.string().min(2, 'State required'),
  reg_country: z.string().default('India'),
  reg_postal_code: z.string().min(5, 'Postal PIN code required'),
  primary_contact_name: z.string().min(2, 'Primary contact name required'),
  primary_contact_email: z.string().email('Valid primary contact email required'),
  primary_contact_phone: z.string().min(10, 'Valid primary phone number required'),
  secondary_contact_name: z.string().optional(),
  secondary_contact_phone: z.string().optional(),

  // Step 4: Banking / Payment Details
  bank_name: z.string().min(2, 'Bank name required'),
  account_holder: z.string().min(2, 'Account holder name required'),
  account_number: z.string().min(8, 'Bank account number required'),
  confirm_account_number: z.string(),
  branch_name: z.string().min(2, 'Branch name required'),
  ifsc_swift_code: z.string().min(4, 'IFSC or SWIFT code required'),
  payment_terms_days: z.coerce.number().default(30),
  preferred_currency: z.string().default('INR'),

  // Step 5: Vendor Category Selection
  category: z.enum(['cash_vendor', 'wcc_partner', 'back_to_back']).default('cash_vendor'),

  // Step 6: Capabilities & References
  expertise_areas: z.array(z.string()).default([]),
  service_locations: z.array(z.string()).default([]),

  // Step 7 & 8: Declaration & Review
  declaration_accepted: z.boolean().refine((val) => val === true, 'You must accept the compliance declaration'),
  is_draft: z.boolean().default(false),
}).refine((data) => data.account_number === data.confirm_account_number, {
  message: "Bank account numbers do not match",
  path: ['confirm_account_number'],
});

export type VendorRegistrationInput = z.infer<typeof vendorRegistrationSchema>;
