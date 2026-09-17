'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import { ROLES_CONFIG } from '@/lib/constants/roles';
import { mockStore } from '@/lib/supabase/mockDb';
import { ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

export function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = React.useState<UserRole>('super_admin');
  const [isChanging, setIsChanging] = React.useState(false);

  React.useEffect(() => {
    const match = document.cookie.match(/user_role=([^;]+)/);
    if (match && match[1]) {
      setCurrentRole(match[1] as UserRole);
    }
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setIsChanging(true);
    document.cookie = `user_role=${role}; path=/; max-age=86400`;
    mockStore.setCurrentUserRole(role);
    setCurrentRole(role);

    const targetPath = ROLES_CONFIG[role].defaultPath;
    setTimeout(() => {
      setIsChanging(false);
      router.push(targetPath);
      router.refresh();
    }, 300);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 px-2">
        <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
        <span className="hidden sm:inline">Active Demo Role:</span>
      </div>

      <div className="relative">
        <select
          value={currentRole}
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          disabled={isChanging}
          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-2.5 py-1 font-medium focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer"
        >
          {Object.values(ROLES_CONFIG).map((roleObj) => (
            <option key={roleObj.name} value={roleObj.name}>
              {roleObj.label}
            </option>
          ))}
        </select>
      </div>

      {isChanging && <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />}
    </div>
  );
}
