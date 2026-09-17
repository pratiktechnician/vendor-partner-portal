'use client';

import React, { useState } from 'react';
import { VendorProfile, VendorApprovals, DocumentItem, Invoice, Ticket, AuditLogItem } from '@/types';
import { RiskIndicatorService } from '@/lib/services/riskIndicatorService';
import { ApprovalPipelineCard } from '@/components/approvals/ApprovalPipelineCard';
import {
  Building2,
  FileText,
  Award,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  History,
  Phone,
  Briefcase,
  Layers,
  AlertTriangle,
  Download,
  Send,
  Plus,
} from 'lucide-react';

interface Vendor360Props {
  vendor: VendorProfile;
  approvals: VendorApprovals;
  documents: DocumentItem[];
  invoices: Invoice[];
  tickets: Ticket[];
}

export const Vendor360ProfileView: React.FC<Vendor360Props> = ({
  vendor,
  approvals,
  documents,
  invoices,
  tickets,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'company'
    | 'contacts'
    | 'documents'
    | 'technical'
    | 'approvals'
    | 'projects'
    | 'commercial'
    | 'workflow'
    | 'invoices'
    | 'tickets'
    | 'communication'
    | 'audit'
  >('overview');

  const riskSignals = RiskIndicatorService.calculateVendorRisk(vendor.id, vendor.organization_name || vendor.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'company', label: 'Company Info', icon: Building2 },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'documents', label: `Documents (${documents.length})`, icon: FileText },
    { id: 'technical', label: 'Technical Assessment', icon: Award },
    { id: 'approvals', label: 'Approvals (L1/L2/L3)', icon: ShieldCheck },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'commercial', label: 'Commercial Rules', icon: CreditCard },
    { id: 'workflow', label: 'Payment Workflow', icon: Layers },
    { id: 'invoices', label: `Invoices (${invoices.length})`, icon: CreditCard },
    { id: 'tickets', label: `Tickets (${tickets.length})`, icon: MessageSquare },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'audit', label: 'Audit Trail', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* 360 Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl text-blue-400 font-bold text-xl">
            {vendor.organization_name ? vendor.organization_name.charAt(0) : 'V'}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-slate-100">{vendor.organization_name || 'Vendor Organization'}</h1>
              <span className="px-3 py-1 text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-full">
                {vendor.vendor_code || 'Awaiting L3 Activation'}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-400 rounded-full uppercase">
                {vendor.category.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Established {vendor.year_established || 2021} • {vendor.city}, {vendor.state} • Preferred Currency: {vendor.preferred_currency}
            </p>
          </div>
        </div>

        {/* Explainable Risk Badge & Actions */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-right">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Vendor Risk Indicator</div>
            <div
              className={`text-sm font-bold uppercase mt-0.5 ${
                riskSignals.risk_level === 'high'
                  ? 'text-rose-400'
                  : riskSignals.risk_level === 'medium'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {riskSignals.risk_level} Risk
            </div>
          </div>

          <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20">
            <Download className="w-4 h-4" /> Download 360 Summary
          </button>
        </div>
      </div>

      {/* Graphical Approval Pipeline */}
      <ApprovalPipelineCard approvals={approvals} vendorCode={vendor.vendor_code} />

      {/* 13-Tab Navigation Header */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-slate-200">Vendor Profile Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Nature of Business</span>
                  <div className="font-semibold text-slate-200 mt-1">{vendor.nature_of_business || 'N/A'}</div>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">MSME Status</span>
                  <div className="font-semibold text-slate-200 mt-1">{vendor.msme_status ? 'Registered MSME' : 'Non-MSME'}</div>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Payment Terms</span>
                  <div className="font-semibold text-slate-200 mt-1">Net {vendor.payment_terms_days} Days</div>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Completion Score</span>
                  <div className="font-semibold text-emerald-400 mt-1">{vendor.profile_completion_pct}%</div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Explainable Risk Signals
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {riskSignals.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-200">Legal & Corporate Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Legal Entity Name</span>
                <div className="font-bold text-slate-200 mt-1">{vendor.organization_name}</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Vendor Category</span>
                <div className="font-bold text-purple-400 uppercase mt-1">{vendor.category}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-200">Mandatory Compliance Documents</h3>
            <div className="space-y-2">
              {documents.map((d) => (
                <div key={d.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{d.file_name}</div>
                    <div className="text-slate-400 capitalize">Category: {d.category}</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-bold capitalize">{d.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-200">Vendor Grievance Tickets</h3>
            <div className="space-y-2">
              {tickets.map((t) => (
                <div key={t.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-mono text-blue-400 font-bold">{t.ticket_number}</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{t.subject}</div>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full font-bold capitalize">{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
