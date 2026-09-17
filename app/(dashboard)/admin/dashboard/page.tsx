'use client';

import React from 'react';
import { MOCK_VENDORS, MOCK_APPROVALS, MOCK_TICKETS } from '@/lib/supabase/mockDb';
import { AttentionRequiredCenter } from '@/components/dashboard/AttentionRequiredCenter';
import { ExecutiveAnalyticsCharts } from '@/components/analytics/Charts';
import { ShieldAlert, Users, Layers, Award, Key, Clock, MessageSquare, AlertOctagon } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const totalVendors = MOCK_VENDORS.length;
  const activeVendors = MOCK_VENDORS.filter((v) => v.vendor_code).length;
  const pendingL1 = MOCK_APPROVALS.filter((a) => a.l1_status === 'Pending L1' || a.l1_status === 'Under Verification').length;
  const pendingL2 = MOCK_APPROVALS.filter((a) => a.l2_status === 'Technical Review In Progress' || a.l2_status === 'Pending Technical Review').length;
  const pendingL3 = MOCK_APPROVALS.filter((a) => a.l3_status === 'Pending Management Approval').length;
  const openTickets = MOCK_TICKETS.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const slaBreaches = MOCK_TICKETS.filter((t) => t.sla_status === 'SLA Breached').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            Vendor Management & Partner Ecosystem Command Center
          </div>
          <h1 className="text-2xl font-black text-slate-100">Executive Partner Ecosystem Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage onboarding, approvals, compliance, payments, and partner support from one workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/approvals"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <ShieldAlert className="w-4 h-4" /> Open Approval Queue
          </Link>
        </div>
      </div>

      {/* Top 5 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400">Total Vendors</div>
          <div className="text-2xl font-black text-slate-100 mt-1">{totalVendors + 245}</div>
          <div className="text-[11px] text-emerald-400 mt-1">196 Active Partners</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400">Pending L1 Verification</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{pendingL1 + 12}</div>
          <div className="text-[11px] text-slate-400 mt-1">Doc Screener Queue</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400">Pending L2 Technical</div>
          <div className="text-2xl font-black text-purple-400 mt-1">{pendingL2 + 8}</div>
          <div className="text-[11px] text-slate-400 mt-1">Project Manager Queue</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400">Pending L3 Management</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{pendingL3 + 5}</div>
          <div className="text-[11px] text-slate-400 mt-1">Executive Final Sign-Off</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-400">SLA Breaches</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{slaBreaches + 3}</div>
          <div className="text-[11px] text-rose-400 mt-1">Urgent Resolution Needed</div>
        </div>
      </div>

      {/* Sequential Approval Pipeline Visualizer */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" /> Sequential Onboarding Approval Pipeline Overview
        </h3>
        <div className="grid grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="font-bold text-slate-300">Registration</div>
            <div className="text-lg font-black text-blue-400 mt-1">31</div>
            <div className="text-[10px] text-slate-400">Submitted</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="font-bold text-slate-300">L1 Doc Verification</div>
            <div className="text-lg font-black text-amber-400 mt-1">14</div>
            <div className="text-[10px] text-slate-400">Under Review</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="font-bold text-slate-300">L2 Technical</div>
            <div className="text-lg font-black text-purple-400 mt-1">9</div>
            <div className="text-[10px] text-slate-400">Assessment</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="font-bold text-slate-300">L3 Management</div>
            <div className="text-lg font-black text-emerald-400 mt-1">6</div>
            <div className="text-[10px] text-slate-400">Final Sign-Off</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="font-bold text-slate-300">Vendor Active</div>
            <div className="text-lg font-black text-emerald-500 mt-1">196</div>
            <div className="text-[10px] text-slate-400">Code Issued</div>
          </div>
        </div>
      </div>

      {/* Attention Required Section */}
      <AttentionRequiredCenter />

      {/* Recharts Analytics Charts */}
      <ExecutiveAnalyticsCharts />
    </div>
  );
}
