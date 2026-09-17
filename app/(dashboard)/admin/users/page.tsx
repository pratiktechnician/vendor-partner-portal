'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/supabase/mockDb';
import { UserProfile, UserRole } from '@/types';
import { ROLES_CONFIG } from '@/lib/constants/roles';
import { UserPlus, Shield, UserX, CheckCircle } from 'lucide-react';

export default function UsersManagementPage() {
  const [users, setUsers] = React.useState<UserProfile[]>(mockStore.getUsers());

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">User & RBAC Role Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage system accounts, assign RBAC permissions, and toggle user active status.</p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold gap-1.5">
          <UserPlus className="w-4 h-4" /> Invite New Employee
        </Button>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name & Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned System Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                    {u.full_name}
                    <span className="block text-xs font-normal text-slate-500">{u.email}</span>
                  </TableCell>
                  <TableCell className="text-xs">{u.department_name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <span key={r} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ROLES_CONFIG[r]?.badgeColor || ''}`}>
                          {ROLES_CONFIG[r]?.label || r}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {u.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleUserStatus(u.id)}
                      className="text-xs font-semibold gap-1"
                    >
                      {u.status === 'active' ? <UserX className="w-3.5 h-3.5 text-rose-500" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                      {u.status === 'active' ? 'Deactivate' : 'Reactivate'}
                    </Button>
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
