'use client';

import React, { useState } from 'react';
import { MOCK_TICKETS } from '@/lib/supabase/mockDb';
import { TicketingDesk } from '@/components/tickets/TicketingDesk';
import { MessageSquare, ShieldAlert } from 'lucide-react';

export default function AdminTicketsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-400" /> Open Ticketing & Non-Technical Grievance Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Integrated partner grievance desk with priority SLAs, conversation threads, and internal staff notes.
          </p>
        </div>
      </div>

      <TicketingDesk
        key={refreshKey}
        tickets={MOCK_TICKETS}
        currentUserId="usr-ticket-support-01"
        currentUserName="Marcus Brody (Support Lead)"
        currentUserRole="ticket_support"
        onRefresh={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}
