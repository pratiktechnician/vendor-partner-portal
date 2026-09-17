'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockStore } from '@/lib/supabase/mockDb';
import { Ticket } from '@/types';
import { formatDate } from '@/lib/utils/formatters';
import { MessageSquare, Plus, Send } from 'lucide-react';

export default function VendorTicketsPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>(mockStore.tickets);
  const [newSubject, setNewSubject] = React.useState('');
  const [newMessageText, setNewMessageText] = React.useState('');

  const handleCreateTicket = () => {
    if (!newSubject.trim() || !newMessageText.trim()) return;

    const newTkt: Ticket = {
      id: `tkt-${Date.now()}`,
      organization_id: 'org-vendor-01',
      organization_name: 'Apex Tech Solutions Pvt Ltd',
      ticket_number: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'invoice',
      subject: newSubject,
      priority: 'medium',
      status: 'open',
      created_by_name: 'Rajesh Sharma',
      created_at: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticket_id: `tkt-${Date.now()}`,
          sender_id: 'usr-vendor-01',
          sender_name: 'Rajesh Sharma',
          sender_role: 'Vendor',
          message: newMessageText,
          created_at: new Date().toISOString(),
        },
      ],
    };

    setTickets([newTkt, ...tickets]);
    mockStore.tickets.unshift(newTkt);
    setNewSubject('');
    setNewMessageText('');
    alert('Support ticket created successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Invoice & Payout Query Support</h1>
        <p className="text-xs text-slate-500 mt-1">Raise structured query tickets regarding registration, document verification, or invoice processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Raise Ticket Form */}
        <Card className="lg:col-span-1 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold">Raise New Query Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Subject / Summary *</label>
              <Input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. Invoice INV-0881 Payment Run Status" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Detailed Message *</label>
              <textarea
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                rows={4}
                placeholder="Provide details regarding your query..."
                className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <Button onClick={handleCreateTicket} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs gap-1.5">
              <Plus className="w-4 h-4" /> Raise Query Ticket
            </Button>
          </CardContent>
        </Card>

        {/* Existing Tickets List */}
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold">My Query Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-sky-600">{tkt.ticket_number}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {tkt.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{tkt.subject}</h4>
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  {tkt.messages?.map((m) => (
                    <div key={m.id} className="text-xs p-2 bg-white dark:bg-slate-800 rounded border space-y-1">
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{m.sender_name}</span>
                        <span>{formatDate(m.created_at)}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
