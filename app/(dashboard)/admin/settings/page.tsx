'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Settings2 } from 'lucide-react';

export default function SystemSettingsPage() {
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Global Portal System Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Configure company profiles, notification targets, and document verification rules.</p>
        </div>
        <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold gap-1.5">
          {saved ? <Check className="w-4 h-4" /> : <Settings2 className="w-4 h-4" />}
          {saved ? 'Settings Saved' : 'Save System Settings'}
        </Button>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Company & Portal Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Company Legal Name</label>
              <Input defaultValue="Acme Global Enterprise Inc." />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Billing Support Email</label>
              <Input defaultValue="billing@acmeglobal.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Default Base Currency</label>
              <Input defaultValue="INR" readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Max Upload File Size (MB)</label>
              <Input type="number" defaultValue={15} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
