'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sliders, Plus, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

export default function WorkflowConfigPage() {
  const [thresholds, setThresholds] = React.useState([
    { id: 1, name: 'Standard Tier', max: 50000, sequence: 'Dept Approver ➔ Finance' },
    { id: 2, name: 'Mid Tier', max: 500000, sequence: 'Dept Head ➔ Procurement ➔ Finance' },
    { id: 3, name: 'High Value Tier', max: 5000000, sequence: 'Dept Head ➔ Procurement ➔ Finance Head ➔ Super Admin' },
  ]);

  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Approval Workflow Engine Configuration</h1>
          <p className="text-xs text-slate-500 mt-1">Configure amount thresholds and multi-tier approval sequences dynamically.</p>
        </div>
        <Button onClick={handleSave} className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold gap-1.5">
          {saved ? <Check className="w-4 h-4" /> : <Sliders className="w-4 h-4" />}
          {saved ? 'Rules Saved!' : 'Save Workflow Rules'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {thresholds.map((t) => (
          <Card key={t.id} className="border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold">{t.name}</CardTitle>
              <span className="text-xs font-mono font-bold text-sky-600">Up to {formatCurrency(t.max)}</span>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Max Threshold Amount (₹)</label>
                <Input
                  type="number"
                  value={t.max}
                  onChange={(e) =>
                    setThresholds(thresholds.map((item) => (item.id === t.id ? { ...item, max: Number(e.target.value) } : item)))
                  }
                  className="max-w-xs text-xs"
                />
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-slate-100">Approval Sequence:</span> {t.sequence}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
