'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/supabase/mockDb';
import { exportToCsv } from '@/lib/utils/exportCsv';
import { Download, Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CustomerMasterPage() {
  const [search, setSearch] = React.useState('');
  const customers = mockStore.organizations.filter((o) => o.entity_type === 'customer');

  const filtered = customers.filter(
    (c) =>
      c.legal_name.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_code?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const data = filtered.map((c) => ({
      CustomerCode: c.customer_code || 'PENDING',
      LegalName: c.legal_name,
      TaxID: c.tax_id || '',
      RegistrationNumber: c.registration_number || '',
      Status: c.status,
    }));
    exportToCsv('Customer_Master_Register', data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Customer Master Register</h1>
          <p className="text-xs text-slate-500 mt-1">Directory of onboarded customer accounts and master service agreements.</p>
        </div>
        <Button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 self-start">
          <Download className="w-4 h-4" /> Export CSV Master
        </Button>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search customer name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Code</TableHead>
                <TableHead>Legal Customer Name</TableHead>
                <TableHead>Tax Identity / PAN</TableHead>
                <TableHead>Reg #</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono font-bold text-teal-600">{c.customer_code || 'CST-2026-00042'}</TableCell>
                  <TableCell className="font-bold text-slate-900 dark:text-slate-100">{c.legal_name}</TableCell>
                  <TableCell className="font-mono text-xs">{c.tax_id || 'N/A'}</TableCell>
                  <TableCell className="font-mono text-xs">{c.registration_number || 'N/A'}</TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} type="entity" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
