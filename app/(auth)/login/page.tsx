'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { UserRole } from '@/types';
import { ROLES_CONFIG } from '@/lib/constants/roles';
import { mockStore } from '@/lib/supabase/mockDb';
import { Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@company.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/admin/dashboard');
    }, 600);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    document.cookie = `user_role=${role}; path=/; max-age=86400`;
    mockStore.setCurrentUserRole(role);
    const targetPath = ROLES_CONFIG[role].defaultPath;
    router.push(targetPath);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-sky-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign in to Portal</h1>
          <p className="text-xs text-slate-500">Access your vendor, customer, or employee account</p>
        </div>

        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-lg">Account Login</CardTitle>
              <CardDescription>Enter registered email & password</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Email Address</label>
                <Input {...register('email')} placeholder="user@company.com" />
                {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold">Password</label>
                  <Link href="/forgot-password" className="text-xs text-sky-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input type="password" {...register('password')} placeholder="••••••••" />
                {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold">
                {isSubmitting ? 'Authenticating...' : 'Sign In'}
              </Button>
            </CardContent>
          </form>

          {/* Quick Demo Switcher Panel */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Instant One-Click Demo Logins:</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {(Object.keys(ROLES_CONFIG) as UserRole[]).map((r) => (
                <Button
                  key={r}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemoLogin(r)}
                  className="text-[11px] justify-start h-8 font-medium truncate"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500 mr-1.5 shrink-0" />
                  {ROLES_CONFIG[r].label.split(' ')[0]}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className="text-center text-xs text-slate-500 space-x-4">
          <Link href="/register/vendor" className="text-sky-600 hover:underline">Register Vendor Account</Link>
          <span>•</span>
          <Link href="/register/customer" className="text-sky-600 hover:underline">Register Customer Account</Link>
        </div>
      </div>
    </div>
  );
}
