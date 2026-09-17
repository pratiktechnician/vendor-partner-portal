'use client';

import React, { useState } from 'react';
import { VendorApprovals, VendorProfile } from '@/types';
import { ShieldAlert, CheckCircle, XCircle, RotateCcw, Key, X, Check } from 'lucide-react';

interface L3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: VendorProfile;
  approvals: VendorApprovals;
  riskLevel?: 'low' | 'medium' | 'high';
  riskReasons?: string[];
  onProcessL3: (action: 'approve' | 'reject' | 'return_l1' | 'return_l2', comments?: string) => Promise<string | void>;
}

export const L3ManagementApprovalModal: React.FC<L3ModalProps> = ({
  isOpen,
  onClose,
  vendor,
  approvals,
  riskLevel = 'low',
  riskReasons = [],
  onProcessL3,
}) => {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDecision = async (action: 'approve' | 'reject' | 'return_l1' | 'return_l2') => {
    setLoading(true);
    try {
      const code = await onProcessL3(action, comments);
      if (code) {
        setGeneratedCode(code);
      } else {
        onClose();
      }
    } catch (err: any) {
      alert(err.message || 'Error processing L3 Management Approval');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">L3 – Final Management Approval & Activation</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Vendor: <span className="font-semibold text-slate-200">{vendor.organization_name || vendor.id}</span> • Category:{' '}
              <span className="uppercase font-bold text-blue-400">{vendor.category.replace('_', ' ')}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Vendor Code Success Banner */}
          {generatedCode && (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <Check className="w-5 h-5" /> Vendor Activation Completed & Code Issued!
                </div>
                <div className="text-2xl font-mono font-black text-slate-100 mt-2">{generatedCode}</div>
                <div className="text-xs text-slate-400 mt-1">Unique transactional vendor code recorded in database audit logs.</div>
              </div>
              <button onClick={onClose} className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500">
                Close
              </button>
            </div>
          )}

          {/* Executive Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-400">L1 Document Verification</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">{approvals.l1_status}</div>
              <div className="text-[11px] text-slate-400 mt-1">By: {approvals.l1_verifier_name || 'Client Verifier'}</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-400">L2 Technical Assessment</div>
              <div className="text-sm font-bold text-purple-400 mt-1">{approvals.l2_status}</div>
              <div className="text-[11px] text-slate-400 mt-1">By: {approvals.l2_approver_name || 'Project Manager'}</div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-400">Explainable Risk Signals</div>
              <div
                className={`text-sm font-bold mt-1 uppercase ${
                  riskLevel === 'high' ? 'text-rose-400' : riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {riskLevel} Risk
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{riskReasons[0] || 'No compliance risk signals'}</div>
            </div>
          </div>

          {/* L1 & L2 Reviewer Comments */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="font-semibold text-slate-300">L1 Verifier Notes:</span>{' '}
              <span className="text-slate-400">{approvals.l1_comments || 'No comments'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-300">L2 Technical Notes:</span>{' '}
              <span className="text-slate-400">{approvals.l2_comments || 'No comments'}</span>
            </div>
          </div>

          {/* Executive Management Comments Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Management Approval Notes / Instructions</label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter management decision notes or specific instructions for activation..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        {!generatedCode && (
          <div className="p-6 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                disabled={loading}
                onClick={() => handleDecision('return_l1')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Return L1
              </button>
              <button
                disabled={loading}
                onClick={() => handleDecision('return_l2')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Return L2
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={loading}
                onClick={() => handleDecision('reject')}
                className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject Management Approval
              </button>
              <button
                disabled={loading}
                onClick={() => handleDecision('approve')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle className="w-4 h-4" /> Final Approve & Issue Vendor Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
