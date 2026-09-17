'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export default function CustomerTicketsPage() {
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleCreate = () => {
    if (!subject.trim()) return;
    alert('Customer support query ticket created!');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Customer Support Queries</h1>
        <p className="text-xs text-slate-500 mt-1">Submit technical or billing support inquiries.</p>
      </div>

      <Card className="max-w-xl border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Raise Support Inquiry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Service agreement update..." />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>
          <Button onClick={handleCreate} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs gap-1.5">
            <Plus className="w-4 h-4" /> Submit Support Ticket
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
