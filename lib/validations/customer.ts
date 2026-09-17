import { z } from 'zod';

export const customerRegistrationSchema = z.object({
  email: z.string().email('Valid email address required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),

  legal_name: z.string().min(2, 'Legal customer name is required'),
  customer_type: z.enum(['enterprise', 'sme', 'government', 'individual']),
  registration_number: z.string().min(3, 'Registration/Incorporation number required'),
  tax_id: z.string().min(3, 'Tax identity number required'),
  billing_currency: z.string().default('INR'),

  billing_street: z.string().min(3, 'Billing street address required'),
  billing_city: z.string().min(2, 'City required'),
  billing_state: z.string().min(2, 'State required'),
  billing_postal_code: z.string().min(5, 'Postal code required'),

  primary_contact_name: z.string().min(2, 'Primary contact name required'),
  primary_contact_email: z.string().email('Valid contact email required'),
  primary_contact_phone: z.string().min(10, 'Valid contact phone required'),

  requested_services: z.array(z.string()).min(1, 'Select at least one requested service'),

  declaration_accepted: z.boolean().refine((val) => val === true, 'You must accept the terms of service'),
});

export type CustomerRegistrationInput = z.infer<typeof customerRegistrationSchema>;
