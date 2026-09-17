'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { mockStore } from '@/lib/supabase/mockDb';
import { maskAccountNumber } from '@/lib/utils/masking';
import { ShieldCheck, Building, CreditCard, Mail, Phone, Globe } from 'lucide-react';

export default function VendorProfilePage() {
  const vendor = mockStore.organizations.find((o) => o.entity_type === 'vendor') || mockStore.organizations[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Organization Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Verified company, contact, tax, and masked bank account records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building className="w-5 h-5 text-sky-600" /> Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p><strong>Legal Name:</strong> {vendor.legal_name}</p>
            <p><strong>Vendor Code:</strong> <code className="font-mono text-sky-600">{vendor.vendor_code}</code></p>
            <p><strong>Registration Number:</strong> {vendor.registration_number}</p>
            <p><strong>PAN Tax Identity:</strong> {vendor.pan}</p>
            <p><strong>GSTIN Number:</strong> {vendor.gstin}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" /> Banking & Payout Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4" /> Account status: Verified for Payouts
            </div>
            <p><strong>Bank Name:</strong> HDFC Bank Ltd</p>
            <p><strong>Account Holder:</strong> {vendor.legal_name}</p>
            <p><strong>Account Number:</strong> <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{maskAccountNumber('998822334411')}</span></p>
            <p><strong>IFSC Code:</strong> HDFC0001234</p>
            <p><strong>Payment Terms:</strong> Net 30 Days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
