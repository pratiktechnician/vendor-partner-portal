'use client';

import React from 'react';
import { AlertOctagon, Clock, FileWarning, Ticket, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AttentionItem {
  id: string;
  type: 'sla_breach' | 'pending_approval' | 'critical_ticket' | 'expiring_doc';
  title: string;
  subtitle: string;
  badge: string;
  link: string;
}

interface AttentionCenterProps {
  items?: AttentionItem[];
}

export const AttentionRequiredCenter: React.FC<AttentionCenterProps> = ({ items }) => {
  const defaultItems: AttentionItem[] = [
    {
      id: 'att-01',
      type: 'sla_breach',
      title: 'SLA Breached: Technical Review Overdue',
      subtitle: 'Nexus Global Logistics Solutions Ltd (Back-to-Back Partner) • Exceeded 48h SLA',
      badge: 'SLA Breached',
      link: '/admin/approvals',
    },
    {
      id: 'att-02',
      type: 'pending_approval',
      title: 'L3 Final Approval Pending',
      subtitle: 'Vortex Systems & Infrastructure Corp (WCC Partner) • L1 & L2 Completed',
      badge: 'L3 Pending',
      link: '/admin/approvals',
    },
    {
      id: 'att-03',
      type: 'critical_ticket',
      title: 'Critical Ticket: Payment Advice Download Issue',
      subtitle: 'TKT-2026-000101 • Apex Tech Solutions • Open for 12 hours',
      badge: 'Critical Ticket',
      link: '/admin/tickets',
    },
    {
      id: 'att-04',
      type: 'expiring_doc',
      title: 'Expired Document: MSME Registration',
      subtitle: 'Nexus Global Logistics • Expired on 2026-01-01',
      badge: 'Expired Doc',
      link: '/admin/document-reviews',
    },
  ];

  const displayItems = items || defaultItems;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Attention Required Command Center</h3>
            <p className="text-xs text-slate-400 mt-0.5">Surfacing operational SLA breaches, pending approvals, and expiring documents</p>
          </div>
        </div>

        <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
          {displayItems.length} Urgent Items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between"
          >
            <div className="space-y-1 pr-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    item.type === 'sla_breach'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : item.type === 'pending_approval'
                      ? 'bg-purple-500/20 text-purple-400'
                      : item.type === 'critical_ticket'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {item.badge}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-100">{item.title}</div>
              <div className="text-[11px] text-slate-400 leading-normal">{item.subtitle}</div>
            </div>

            <Link
              href={item.link}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-blue-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors self-center"
            >
              Action <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
