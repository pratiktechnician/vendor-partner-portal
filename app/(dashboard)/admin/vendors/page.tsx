'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/supabase/mockDb';
import { maskAccountNumber } from '@/lib/utils/masking';
import { exportToCsv } from '@/lib/utils/exportCsv';
import { Download, ShieldCheck, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function VendorMasterPage() {
  const [search, setSearch] = React.useState('');
  const vendors = mockStore.organizations.filter((o) => o.entity_type === 'vendor');

  const filtered = vendors.filter(
    (v) =>
      v.legal_name.toLowerCase().includes(search.toLowerCase()) ||
      v.vendor_code?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const data = filtered.map((v) => ({
      VendorCode: v.vendor_code || 'PENDING',
      LegalName: v.legal_name,
      TradingName: v.trading_name || '',
      RegistrationNumber: v.registration_number || '',
      PAN: v.pan || '',
      GSTIN: v.gstin || '',
      Status: v.status,
    }));
    exportToCsv('Vendor_Master_Register', data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Active Vendor Master Register</h1>
          <p className="text-xs text-slate-500 mt-1">Directory of registered vendor partners with protected banking views.</p>
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
              placeholder="Search vendor name or code..."
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
                <TableHead>Vendor Code</TableHead>
                <TableHead>Legal Organization Name</TableHead>
                <TableHead>GSTIN / Tax ID</TableHead>
                <TableHead>Bank Account (Protected)</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono font-bold text-sky-600">{v.vendor_code || 'IN REVIEW'}</TableCell>
                  <TableCell className="font-bold text-slate-900 dark:text-slate-100">{v.legal_name}</TableCell>
                  <TableCell className="font-mono text-xs">{v.gstin || v.pan || 'N/A'}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {maskAccountNumber('998822334411')}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize text-xs font-semibold">{v.risk_level}</TableCell>
                  <TableCell>
                    <StatusBadge status={v.status} type="entity" />
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
