'use client';

import React, { useState } from 'react';
import { VendorCategory } from '@/types';
import {
  Building2,
  FileText,
  Phone,
  CreditCard,
  Layers,
  Award,
  CheckCircle,
  Save,
  ArrowRight,
  ArrowLeft,
  Upload,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function VendorRegistrationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    legal_name: '',
    trading_name: '',
    organization_type: 'private_limited',
    year_established: 2021,
    website: '',
    nature_of_business: '',
    registration_number: '',
    pan: '',
    gstin: '',
    cin_number: '',
    msme_status: false,
    msme_category: 'none',

    reg_street: '',
    reg_city: '',
    reg_state: '',
    reg_postal_code: '',
    primary_contact_name: '',
    primary_contact_email: '',
    primary_contact_phone: '',
    secondary_contact_name: '',
    secondary_contact_phone: '',

    bank_name: '',
    account_holder: '',
    account_number: '',
    confirm_account_number: '',
    branch_name: '',
    ifsc_swift_code: '',
    payment_terms_days: 30,
    preferred_currency: 'INR',

    category: 'cash_vendor' as VendorCategory,
    expertise_areas: ['IT Infrastructure', 'Cloud Services'],
    service_locations: ['Delhi NCR', 'Mumbai', 'Bengaluru'],

    declaration_accepted: false,
  });

  const steps = [
    { num: 1, title: 'Organization Info', icon: Building2 },
    { num: 2, title: 'Business & Legal', icon: FileText },
    { num: 3, title: 'Contacts & Address', icon: Phone },
    { num: 4, title: 'Banking Details', icon: CreditCard },
    { num: 5, title: 'Vendor Category', icon: Layers },
    { num: 6, title: 'Document Upload', icon: Upload },
    { num: 7, title: 'Declaration', icon: ShieldCheck },
    { num: 8, title: 'Review & Submit', icon: CheckCircle },
  ];

  const calculateCompletion = () => {
    let filled = 0;
    const totalFields = 12;
    if (formData.legal_name) filled++;
    if (formData.registration_number) filled++;
    if (formData.pan) filled++;
    if (formData.gstin) filled++;
    if (formData.reg_street) filled++;
    if (formData.reg_city) filled++;
    if (formData.primary_contact_name) filled++;
    if (formData.primary_contact_email) filled++;
    if (formData.bank_name) filled++;
    if (formData.account_number) filled++;
    if (formData.ifsc_swift_code) filled++;
    if (formData.declaration_accepted) filled++;

    return Math.min(100, Math.round((filled / totalFields) * 100));
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    alert('Vendor onboarding draft saved successfully! You can resume completion anytime.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Vendor onboarding application submitted successfully! L1 Document Verification initiated.');
      router.push('/vendor/dashboard');
    }, 1000);
  };

  const completionPct = calculateCompletion();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100">Vendor & Partner Onboarding Wizard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete the 8-step registration wizard to initiate 3-tier L1/L2/L3 onboarding verification.
          </p>
        </div>

        {/* Completion Progress Bar */}
        <div className="w-full md:w-64 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-400">Profile Completion</span>
            <span className="font-bold text-emerald-400">{completionPct}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>

      {/* Step Stepper Header */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {steps.map((stg) => {
          const Icon = stg.icon;
          const isActive = currentStep === stg.num;
          const isDone = currentStep > stg.num;

          return (
            <button
              key={stg.num}
              onClick={() => setCurrentStep(stg.num)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                  : isDone
                  ? 'bg-slate-900 border-emerald-500/50 text-slate-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span>Step {stg.num}</span>
                {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="text-[11px] font-semibold truncate">{stg.title}</div>
            </button>
          );
        })}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Step 1: Organization Info */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-100">Step 1 – Organization Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Legal Organization Name *</label>
                <input
                  type="text"
                  required
                  value={formData.legal_name}
                  onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                  placeholder="e.g. Apex Tech Solutions Pvt Ltd"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Trading / Brand Name</label>
                <input
                  type="text"
                  value={formData.trading_name}
                  onChange={(e) => setFormData({ ...formData, trading_name: e.target.value })}
                  placeholder="e.g. Apex Technologies"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Organization Structure</label>
                <select
                  value={formData.organization_type}
                  onChange={(e) => setFormData({ ...formData, organization_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                >
                  <option value="private_limited">Private Limited</option>
                  <option value="public_limited">Public Limited</option>
                  <option value="proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership Firm</option>
                  <option value="llp">LLP</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Year Established</label>
                <input
                  type="number"
                  value={formData.year_established}
                  onChange={(e) => setFormData({ ...formData, year_established: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Vendor Category Selection */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-100">Step 5 – Select Vendor Category</h2>
            <p className="text-slate-400">Select your onboarding partner category. Controls mandatory document rules & commercial workflows.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { code: 'cash_vendor', name: '1. Cash Vendor', desc: 'Direct work completion & invoice validation workflow (VND-CASH prefix)' },
                { code: 'wcc_partner', name: '2. WCC Partner', desc: 'Work Order, milestone completion & WCC verification workflow (VND-WCC prefix)' },
                { code: 'back_to_back', name: '3. Back-to-Back Partner', desc: 'Customer milestone, partner validation & commercial acceptance workflow (VND-B2B prefix)' },
              ].map((cat) => (
                <div
                  key={cat.code}
                  onClick={() => setFormData({ ...formData, category: cat.code as VendorCategory })}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    formData.category === cat.code
                      ? 'bg-blue-950/60 border-blue-500 text-slate-100 shadow-xl shadow-blue-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-100 mb-1">{cat.name}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{cat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation & Action Buttons */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save as Draft
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            )}

            {currentStep < 8 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle className="w-4 h-4" /> Submit Onboarding Application
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
