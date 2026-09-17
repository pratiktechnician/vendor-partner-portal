'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { mockStore } from '@/lib/supabase/mockDb';
import { Building, ShieldCheck } from 'lucide-react';

export default function CustomerProfilePage() {
  const customer = mockStore.organizations.find((o) => o.entity_type === 'customer') || mockStore.organizations[2];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Customer Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Verified organization details and requested services.</p>
      </div>

      <Card className="max-w-2xl border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Building className="w-5 h-5 text-teal-600" /> Account Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <p><strong>Legal Name:</strong> {customer?.legal_name}</p>
          <p><strong>Customer ID:</strong> <code className="font-mono text-teal-600">{customer?.customer_code}</code></p>
          <p><strong>Registration Number:</strong> {customer?.registration_number}</p>
          <p><strong>Tax ID:</strong> {customer?.tax_id}</p>
          <p><strong>Billing Currency:</strong> INR</p>
        </CardContent>
      </Card>
    </div>
  );
}
