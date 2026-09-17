'use client';

import React, { useState } from 'react';
import { TechnicalAssessment, VendorApprovals } from '@/types';
import { Award, CheckCircle, XCircle, HelpCircle, X } from 'lucide-react';

interface L2FormProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
  approvals: VendorApprovals;
  onSaveAssessment: (data: Omit<TechnicalAssessment, 'id' | 'created_at'>) => Promise<void>;
}

export const L2TechnicalAssessmentForm: React.FC<L2FormProps> = ({
  isOpen,
  onClose,
  vendorId,
  vendorName,
  approvals,
  onSaveAssessment,
}) => {
  const [scores, setScores] = useState({
    technical_capability: 4,
    relevant_experience: 4,
    resource_availability: 4,
    geographical_capability: 4,
    safety_readiness: 4,
    quality_capability: 4,
    delivery_capability: 4,
    documentation_capability: 4,
  });

  const [notes, setNotes] = useState('');
  const [recommendation, setRecommendation] = useState<'recommend' | 'reject' | 'request_clarification'>('recommend');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleScoreChange = (key: keyof typeof scores, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const calculateOverall = () => {
    const vals = Object.values(scores);
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSaveAssessment({
        vendor_id: vendorId,
        assessor_id: 'usr-l2-pm-01',
        assessor_name: 'Arthur Pendelton (L2 PM)',
        ...scores,
        overall_score: parseFloat(calculateOverall()),
        assessment_notes: notes || 'Structured L2 technical evaluation score submitted.',
        recommendation,
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error saving L2 technical assessment');
    } finally {
      setLoading(false);
    }
  };

  const criteriaList = [
    { key: 'technical_capability', label: '1. Technical Capability & Expertise' },
    { key: 'relevant_experience', label: '2. Relevant Industry Experience & References' },
    { key: 'resource_availability', label: '3. Manpower, Tools & Resource Availability' },
    { key: 'geographical_capability', label: '4. Geographical Reach & Service Coverage' },
    { key: 'safety_readiness', label: '5. Safety Readiness & EHS Compliance' },
    { key: 'quality_capability', label: '6. Quality Standards & Certification Capability' },
    { key: 'delivery_capability', label: '7. Timely Delivery & Milestone Capability' },
    { key: 'documentation_capability', label: '8. Technical Documentation & SLA Support' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-slate-100">L2 – Technical Assessment Evaluation</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Evaluating Project Capabilities for Vendor: <span className="font-semibold text-slate-200">{vendorName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Overall Score Badge */}
          <div className="p-4 rounded-xl border bg-slate-950 border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400">Structured Technical Score (1 to 5 Scale)</div>
              <div className="text-2xl font-black text-purple-400 mt-1">{calculateOverall()} / 5.00</div>
            </div>
            <div className="text-xs text-slate-400">Evaluated by: Project Manager / Technical Approver</div>
          </div>

          {/* 8 Criteria Rating Sliders */}
          <div className="space-y-4">
            {criteriaList.map((crit) => (
              <div key={crit.key} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-200">{crit.label}</span>
                  <span className="text-xs font-bold text-purple-400">{scores[crit.key as keyof typeof scores]} / 5</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleScoreChange(crit.key as keyof typeof scores, val)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        scores[crit.key as keyof typeof scores] === val
                          ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Technical Evaluation Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Technical Assessment Comments & Observations</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add technical evaluation notes, past project capability feedback, or resource readiness observations..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Recommendation Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Technical Assessment Decision</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRecommendation('recommend')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  recommendation === 'recommend'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <CheckCircle className="w-4 h-4" /> Recommend L2
              </button>
              <button
                type="button"
                onClick={() => setRecommendation('request_clarification')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  recommendation === 'request_clarification'
                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Clarification
              </button>
              <button
                type="button"
                onClick={() => setRecommendation('reject')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  recommendation === 'reject'
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <XCircle className="w-4 h-4" /> Reject L2
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20"
          >
            Submit Technical Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
