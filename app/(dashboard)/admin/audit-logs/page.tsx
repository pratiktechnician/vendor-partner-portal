'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { mockStore } from '@/lib/supabase/mockDb';
import { formatDate } from '@/lib/utils/formatters';
import { History, Shield, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AuditLogsPage() {
  const [search, setSearch] = React.useState('');
  const logs = mockStore.auditLogs;

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.entity_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Immutable System Audit Logs</h1>
        <p className="text-xs text-slate-500 mt-1">Read-only audit stream tracking all profile updates, review decisions, invoice workflow transitions, and role assignments.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Filter by action or user..."
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
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Target Entity</TableHead>
                <TableHead>IP Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs font-mono">{formatDate(log.created_at)}</TableCell>
                  <TableCell className="font-bold text-sky-600 text-xs font-mono">{log.action}</TableCell>
                  <TableCell className="font-bold text-slate-900 dark:text-slate-100">{log.actor_name}</TableCell>
                  <TableCell className="text-xs font-semibold capitalize">{log.actor_role}</TableCell>
                  <TableCell className="text-xs capitalize">{log.entity_type} ({log.entity_id?.slice(0, 8)})</TableCell>
                  <TableCell className="text-xs font-mono text-slate-500">{log.ip_address || '127.0.0.1'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
