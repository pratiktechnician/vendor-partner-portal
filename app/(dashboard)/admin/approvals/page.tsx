'use client';

import React, { useState } from 'react';
import { MOCK_VENDORS, MOCK_APPROVALS, MOCK_DOCUMENTS } from '@/lib/supabase/mockDb';
import { VendorApprovalService } from '@/lib/services/vendorApprovalService';
import { RiskIndicatorService } from '@/lib/services/riskIndicatorService';
import { ApprovalPipelineCard } from '@/components/approvals/ApprovalPipelineCard';
import { L1DocumentVerificationModal } from '@/components/approvals/L1DocumentVerificationModal';
import { L2TechnicalAssessmentForm } from '@/components/approvals/L2TechnicalAssessmentForm';
import { L3ManagementApprovalModal } from '@/components/approvals/L3ManagementApprovalModal';
import { ShieldCheck, Award, Key, Clock, Filter, Search } from 'lucide-react';

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<'l1' | 'l2' | 'l3'>('l1');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  // Modals state
  const [l1ModalOpen, setL1ModalOpen] = useState(false);
  const [l2ModalOpen, setL2ModalOpen] = useState(false);
  const [l3ModalOpen, setL3ModalOpen] = useState(false);

  const selectedVendor = MOCK_VENDORS.find((v) => v.id === selectedVendorId) || MOCK_VENDORS[0];
  const selectedApprovals = MOCK_APPROVALS.find((a) => a.vendor_id === selectedVendor.id) || MOCK_APPROVALS[0];
  const selectedDocs = MOCK_DOCUMENTS.filter((d) => d.organization_id === selectedVendor.organization_id);
  const riskSignals = RiskIndicatorService.calculateVendorRisk(selectedVendor.id, selectedVendor.organization_name || selectedVendor.id);

  const handleProcessL1 = async (status: any, comments?: string) => {
    await VendorApprovalService.processL1Review(selectedVendor.id, 'usr-l1-verifier-01', 'Sarah Connor', status, comments);
  };

  const handleProcessL2 = async (data: any) => {
    await VendorApprovalService.processL2Assessment(data);
  };

  const handleProcessL3 = async (action: any, comments?: string) => {
    const result = await VendorApprovalService.processL3Decision(selectedVendor.id, 'usr-l3-mgmt-01', 'David Miller', action, comments);
    return result.generatedCode;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" /> "My Approvals" – Sequential 3-Tier Approval Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sequential Gated Governance: L1 Document Verification ➔ L2 Technical Assessment ➔ L3 Executive Management Approval
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-bold text-xs rounded-full border border-blue-500/30">
            {MOCK_VENDORS.length} Pending Onboardings
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('l1')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'l1' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> L1 Document Verification Queue
        </button>
        <button
          onClick={() => setActiveTab('l2')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'l2' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" /> L2 Technical Assessment Queue
        </button>
        <button
          onClick={() => setActiveTab('l3')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'l3' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" /> L3 Management Approval Queue
        </button>
      </div>

      {/* Selected Vendor Workflow Pipeline */}
      <ApprovalPipelineCard
        approvals={selectedApprovals}
        vendorCode={selectedVendor.vendor_code}
        onOpenL1={() => setL1ModalOpen(true)}
        onOpenL2={() => setL2ModalOpen(true)}
        onOpenL3={() => setL3ModalOpen(true)}
      />

      {/* Queue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-4">Vendor & Category</th>
              <th className="p-4">L1 Doc Status</th>
              <th className="p-4">L2 Technical Status</th>
              <th className="p-4">L3 Mgmt Status</th>
              <th className="p-4">Risk Indicator</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOCK_VENDORS.map((v) => {
              const appr = MOCK_APPROVALS.find((a) => a.vendor_id === v.id) || MOCK_APPROVALS[0];
              const risk = RiskIndicatorService.calculateVendorRisk(v.id, v.organization_name || v.id);

              return (
                <tr key={v.id} className="hover:bg-slate-950/60 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-100">{v.organization_name}</div>
                    <div className="text-[11px] font-mono text-purple-400 uppercase mt-0.5">{v.category.replace('_', ' ')}</div>
                  </td>
                  <td className="p-4 font-semibold text-emerald-400">{appr.l1_status}</td>
                  <td className="p-4 font-semibold text-purple-400">{appr.l2_status}</td>
                  <td className="p-4 font-semibold text-blue-400">{appr.l3_status}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        risk.risk_level === 'high'
                          ? 'bg-rose-500/20 text-rose-400'
                          : risk.risk_level === 'medium'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {risk.risk_level} Risk
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedVendorId(v.id);
                        if (activeTab === 'l1') setL1ModalOpen(true);
                        if (activeTab === 'l2') setL2ModalOpen(true);
                        if (activeTab === 'l3') setL3ModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs"
                    >
                      Review Stage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Review Modals */}
      <L1DocumentVerificationModal
        isOpen={l1ModalOpen}
        onClose={() => setL1ModalOpen(false)}
        vendorId={selectedVendor.id}
        vendorName={selectedVendor.organization_name || selectedVendor.id}
        approvals={selectedApprovals}
        documents={selectedDocs}
        onProcessL1={handleProcessL1}
      />

      <L2TechnicalAssessmentForm
        isOpen={l2ModalOpen}
        onClose={() => setL2ModalOpen(false)}
        vendorId={selectedVendor.id}
        vendorName={selectedVendor.organization_name || selectedVendor.id}
        approvals={selectedApprovals}
        onSaveAssessment={handleProcessL2}
      />

      <L3ManagementApprovalModal
        isOpen={l3ModalOpen}
        onClose={() => setL3ModalOpen(false)}
        vendor={selectedVendor}
        approvals={selectedApprovals}
        riskLevel={riskSignals.risk_level}
        riskReasons={riskSignals.reasons}
        onProcessL3={handleProcessL3}
      />
    </div>
  );
}
