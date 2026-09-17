'use client';

import React from 'react';
import { VendorApprovals, L1ApprovalStatus, L2ApprovalStatus, L3ApprovalStatus } from '@/types';
import { CheckCircle2, Clock, AlertCircle, XCircle, ArrowRight } from 'lucide-react';

interface ApprovalPipelineCardProps {
  approvals: VendorApprovals;
  vendorCode?: string;
  onOpenL1?: () => void;
  onOpenL2?: () => void;
  onOpenL3?: () => void;
}

export const ApprovalPipelineCard: React.FC<ApprovalPipelineCardProps> = ({
  approvals,
  vendorCode,
  onOpenL1,
  onOpenL2,
  onOpenL3,
}) => {
  const getStageState = (stage: 'reg' | 'l1' | 'l2' | 'l3' | 'active') => {
    if (stage === 'reg') return { status: 'completed', label: 'Registration Submitted', color: 'bg-emerald-500 text-white' };

    if (stage === 'l1') {
      if (approvals.l1_status === 'L1 Approved') return { status: 'completed', label: 'L1 Approved', color: 'bg-emerald-500 text-white' };
      if (approvals.l1_status === 'Correction Required') return { status: 'warning', label: 'L1 Correction Required', color: 'bg-amber-500 text-white' };
      if (approvals.l1_status === 'L1 Rejected') return { status: 'rejected', label: 'L1 Rejected', color: 'bg-rose-500 text-white' };
      return { status: 'in_progress', label: 'L1 Pending', color: 'bg-blue-600 text-white animate-pulse' };
    }

    if (stage === 'l2') {
      if (approvals.l1_status !== 'L1 Approved') return { status: 'locked', label: 'L2 Locked (Awaiting L1)', color: 'bg-slate-700 text-slate-400' };
      if (approvals.l2_status === 'L2 Recommended') return { status: 'completed', label: 'L2 Recommended', color: 'bg-emerald-500 text-white' };
      if (approvals.l2_status === 'Clarification Required') return { status: 'warning', label: 'L2 Clarification Required', color: 'bg-amber-500 text-white' };
      if (approvals.l2_status === 'L2 Rejected') return { status: 'rejected', label: 'L2 Rejected', color: 'bg-rose-500 text-white' };
      return { status: 'in_progress', label: 'L2 Technical In Progress', color: 'bg-blue-600 text-white animate-pulse' };
    }

    if (stage === 'l3') {
      if (approvals.l2_status !== 'L2 Recommended') return { status: 'locked', label: 'L3 Locked (Awaiting L2)', color: 'bg-slate-700 text-slate-400' };
      if (approvals.l3_status === 'Approved') return { status: 'completed', label: 'L3 Approved', color: 'bg-emerald-500 text-white' };
      if (approvals.l3_status === 'Returned for Review') return { status: 'warning', label: 'L3 Returned for Review', color: 'bg-amber-500 text-white' };
      if (approvals.l3_status === 'Rejected') return { status: 'rejected', label: 'L3 Rejected', color: 'bg-rose-500 text-white' };
      return { status: 'in_progress', label: 'L3 Management Pending', color: 'bg-purple-600 text-white animate-pulse' };
    }

    if (stage === 'active') {
      if (approvals.l3_status === 'Approved') return { status: 'completed', label: vendorCode || 'Vendor Active', color: 'bg-emerald-500 text-white' };
      return { status: 'pending', label: 'Awaiting Code Generation', color: 'bg-slate-700 text-slate-400' };
    }

    return { status: 'pending', label: 'Pending', color: 'bg-slate-700 text-slate-400' };
  };

  const stages = [
    { key: 'reg', title: '1. Registration', sub: 'Completed' },
    { key: 'l1', title: '2. L1 Doc Verification', sub: approvals.l1_verifier_name || 'Client Verifier Queue', action: onOpenL1 },
    { key: 'l2', title: '3. L2 Technical Assessment', sub: approvals.l2_approver_name || 'Project Manager Queue', action: onOpenL2 },
    { key: 'l3', title: '4. L3 Management Approval', sub: approvals.l3_approver_name || 'Executive Queue', action: onOpenL3 },
    { key: 'active', title: '5. Vendor Activation', sub: vendorCode || 'Code Pending' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            Sequential 3-Tier Vendor Onboarding Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Gated progression: Registration ➔ L1 Verification ➔ L2 Technical ➔ L3 Executive ➔ Vendor Code Generation
          </p>
        </div>
        {vendorCode && (
          <span className="px-3 py-1 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">
            {vendorCode}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {stages.map((stg, idx) => {
          const state = getStageState(stg.key as any);
          return (
            <div
              key={stg.key}
              onClick={state.status !== 'locked' ? stg.action : undefined}
              className={`p-4 rounded-xl border transition-all ${
                state.status === 'completed'
                  ? 'bg-slate-950 border-emerald-500/40 text-slate-100'
                  : state.status === 'in_progress'
                  ? 'bg-blue-950/60 border-blue-500/60 text-slate-100 shadow-lg shadow-blue-500/10 cursor-pointer hover:scale-102'
                  : state.status === 'warning'
                  ? 'bg-amber-950/50 border-amber-500/50 text-slate-100 cursor-pointer'
                  : state.status === 'rejected'
                  ? 'bg-rose-950/50 border-rose-500/50 text-slate-100'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">{stg.title}</span>
                {state.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {state.status === 'in_progress' && <Clock className="w-4 h-4 text-blue-400 animate-spin" />}
                {state.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                {state.status === 'rejected' && <XCircle className="w-4 h-4 text-rose-400" />}
              </div>

              <div className={`px-2.5 py-1 rounded text-xs font-bold w-max ${state.color}`}>{state.label}</div>

              <div className="text-[11px] text-slate-400 mt-2 truncate">{stg.sub}</div>

              {stg.action && state.status !== 'locked' && (
                <button className="mt-3 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  Open Stage <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
