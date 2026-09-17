'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockStore } from '@/lib/supabase/mockDb';
import { Building, FileCheck2, MessageSquare, CheckCircle } from 'lucide-react';

export default function CustomerDashboardPage() {
  const customer = mockStore.organizations.find((o) => o.entity_type === 'customer') || mockStore.organizations[2];

  return (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
              {customer?.customer_code || 'CST-2026-00042'}
            </span>
            <StatusBadge status={customer?.status || 'approved'} type="entity" />
          </div>
          <h1 className="text-2xl font-extrabold">{customer?.legal_name || 'Horizon Global Logistics LLC'}</h1>
          <p className="text-xs text-teal-200 mt-1">Customer Client Portal • Tax ID: {customer?.tax_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Onboarding Status</p>
              <p className="text-xl font-bold text-teal-600 capitalize">{customer?.status || 'Active'}</p>
              <p className="text-[11px] text-slate-400">Master Agreement Active</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Agreements Verified</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">100%</p>
              <p className="text-[11px] text-emerald-600">All compliance verified</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Open Tickets</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">0</p>
              <p className="text-[11px] text-slate-400">No active queries</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
