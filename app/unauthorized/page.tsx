import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="max-w-md w-full text-center p-6 border-rose-200 dark:border-rose-900 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">403 - Access Restricted</CardTitle>
        <CardDescription className="mt-2 text-slate-600 dark:text-slate-400">
          Your current user role does not have authorization to view this area or perform this server operation.
        </CardDescription>

        <div className="mt-6 flex flex-col gap-2">
          <Link href="/login">
            <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white gap-2 font-semibold">
              <ArrowLeft className="w-4 h-4" /> Switch Role or Log In
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">Return to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
