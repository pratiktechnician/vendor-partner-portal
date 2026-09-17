'use client';

import React, { useState } from 'react';
import { VendorApprovals, L1ApprovalStatus, DocumentItem } from '@/types';
import { CheckCircle, XCircle, AlertTriangle, FileText, ShieldCheck, X } from 'lucide-react';

interface L1ModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
  approvals: VendorApprovals;
  documents: DocumentItem[];
  onProcessL1: (status: L1ApprovalStatus, comments?: string) => Promise<void>;
}

export const L1DocumentVerificationModal: React.FC<L1ModalProps> = ({
  isOpen,
  onClose,
  vendorId,
  vendorName,
  approvals,
  documents,
  onProcessL1,
}) => {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  if (!isOpen) return null;

  const handleDecision = async (status: L1ApprovalStatus) => {
    setLoading(true);
    try {
      await onProcessL1(status, comments);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error processing L1 review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-slate-100">L1 – Document Verification Review</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Vendor: <span className="font-semibold text-slate-200">{vendorName}</span> (ID: {vendorId})
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Status Alert Banner */}
          <div className="p-4 rounded-xl border bg-slate-950 border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400">Current L1 Review Status</div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">{approvals.l1_status}</div>
            </div>
            {approvals.l1_verifier_name && (
              <div className="text-right text-xs text-slate-400">
                Verified by: <span className="text-slate-200 font-medium">{approvals.l1_verifier_name}</span>
              </div>
            )}
          </div>

          {/* Documents Review List */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" /> Uploaded Mandatory Compliance Documents ({documents.length})
            </h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    selectedDoc?.id === doc.id
                      ? 'bg-blue-950/40 border-blue-500/60'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="text-sm font-medium text-slate-200">{doc.file_name}</div>
                      <div className="text-xs text-slate-400 capitalize">
                        Category: {doc.category} • Size: {(doc.file_size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                      doc.status === 'verified'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : doc.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {doc.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Notes Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">L1 Reviewer Verification Notes / Reason</label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add comments regarding document validity, PAN/GST checks, bank verification, or correction reasons..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            disabled={loading}
            onClick={() => handleDecision('Correction Required')}
            className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Request Correction
          </button>

          <div className="flex items-center gap-3">
            <button
              disabled={loading}
              onClick={() => handleDecision('L1 Rejected')}
              className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Reject L1
            </button>
            <button
              disabled={loading}
              onClick={() => handleDecision('L1 Approved')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle className="w-4 h-4" /> Approve L1 Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
