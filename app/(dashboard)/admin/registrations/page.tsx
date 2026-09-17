'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/supabase/mockDb';
import { CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function PendingRegistrationsPage() {
  const [organizations, setOrganizations] = React.useState(mockStore.organizations);
  const [search, setSearch] = React.useState('');

  const filtered = organizations.filter(
    (o) =>
      o.legal_name.toLowerCase().includes(search.toLowerCase()) ||
      o.registration_number?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApproveRegistration = (id: string) => {
    const nextCode = `VND-2026-${Math.floor(100 + Math.random() * 900)}`;
    setOrganizations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'approved', vendor_code: nextCode } : o))
    );
    mockStore.logAudit('VENDOR_REGISTRATION_APPROVED', 'organization', id, { status: 'under_review' }, { status: 'approved', vendor_code: nextCode });
    alert(`Vendor Application Approved! Generated Vendor Code: ${nextCode}`);
  };

  const handleRejectRegistration = (id: string) => {
    const reason = prompt('Enter mandatory rejection reason:');
    if (!reason) return;

    setOrganizations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'rejected' } : o))
    );
    mockStore.logAudit('VENDOR_REGISTRATION_REJECTED', 'organization', id, { status: 'under_review' }, { status: 'rejected', reason });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Pending Registrations Review Queue</h1>
        <p className="text-xs text-slate-500 mt-1">Review vendor and customer applications prior to generating official codes.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search by legal name or reg #..."
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
                <TableHead>Legal Organization Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reg / CIN #</TableHead>
                <TableHead>PAN / Tax ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                    {org.legal_name}
                    {org.vendor_code && <span className="block text-[11px] font-mono text-sky-600">{org.vendor_code}</span>}
                  </TableCell>
                  <TableCell className="capitalize text-xs font-semibold">{org.entity_type}</TableCell>
                  <TableCell className="font-mono text-xs">{org.registration_number || 'N/A'}</TableCell>
                  <TableCell className="font-mono text-xs">{org.pan || org.tax_id || 'N/A'}</TableCell>
                  <TableCell>
                    <StatusBadge status={org.status} type="entity" />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {org.status !== 'approved' && org.status !== 'rejected' ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproveRegistration(org.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectRegistration(org.id)}
                          className="text-xs font-semibold gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Action Complete</span>
                    )}
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
