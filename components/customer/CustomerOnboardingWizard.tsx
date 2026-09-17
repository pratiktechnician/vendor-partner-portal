'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerRegistrationSchema, CustomerRegistrationInput } from '@/lib/validations/customer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FileUploader } from '@/components/shared/FileUploader';
import { mockStore } from '@/lib/supabase/mockDb';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export function CustomerOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CustomerRegistrationInput>({
    resolver: zodResolver(customerRegistrationSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      legal_name: '',
      customer_type: 'enterprise',
      registration_number: '',
      tax_id: '',
      billing_currency: 'INR',
      billing_street: '',
      billing_city: '',
      billing_state: '',
      billing_postal_code: '',
      primary_contact_name: '',
      primary_contact_email: '',
      primary_contact_phone: '',
      requested_services: ['Software Services'],
      declaration_accepted: true,
    },
  });

  const onSubmit = (data: CustomerRegistrationInput) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newOrg = {
        id: `org-customer-${Date.now()}`,
        legal_name: data.legal_name,
        entity_type: 'customer' as const,
        registration_number: data.registration_number,
        tax_id: data.tax_id,
        status: 'under_review' as const,
        risk_level: 'low' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockStore.organizations.unshift(newOrg);
      mockStore.logAudit('CUSTOMER_ONBOARDING_SUBMITTED', 'organization', newOrg.id, null, newOrg);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto my-8 p-8 text-center bg-emerald-50/50 border-emerald-200">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
        <CardTitle className="text-xl">Customer Onboarding Submitted!</CardTitle>
        <CardDescription className="mt-2">
          Your customer registration application has been submitted for review.
        </CardDescription>
        <Button onClick={() => router.push('/customer/dashboard')} className="mt-6 bg-sky-600">
          Go to Customer Dashboard
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Customer Organization Onboarding Wizard</CardTitle>
          <CardDescription>Register your company for master service agreement setup.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Corporate Email *</label>
                  <Input {...register('email')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Password *</label>
                  <Input type="password" {...register('password')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Legal Customer Name *</label>
                  <Input {...register('legal_name')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Tax ID / PAN *</label>
                  <Input {...register('tax_id')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Registration Number *</label>
                  <Input {...register('registration_number')} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1">Billing Street Address *</label>
                  <Input {...register('billing_street')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">City *</label>
                  <Input {...register('billing_city')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">State *</label>
                  <Input {...register('billing_state')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Postal Code *</label>
                  <Input {...register('billing_postal_code')} />
                </div>
                <div className="md:col-span-2">
                  <FileUploader label="Upload Service Agreement / NDA Copy *" onUploadSuccess={() => {}} />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t p-4">
            {step === 1 ? (
              <Button type="button" onClick={() => setStep(2)}>Next</Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Previous</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white font-bold">
                  {isSubmitting ? 'Submitting...' : 'Submit Onboarding'}
                </Button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
