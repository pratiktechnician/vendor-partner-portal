'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, FileText, CheckCircle2, Download, ArrowLeft, Building2, Printer } from 'lucide-react';

function DocumentViewerContent() {
  const searchParams = useSearchParams();
  const docName = searchParams.get('doc') || 'GST_Certificate_ApexTech.pdf';
  const vendorName = searchParams.get('vendor') || 'Apex Tech Solutions Pvt Ltd';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/approvals"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Approvals
          </Link>
          <div className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold text-slate-100">{docName}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold">
              Verified
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={() => alert('Downloaded certified copy: ' + docName)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow-lg shadow-blue-600/20 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 flex justify-center items-start overflow-y-auto">
        <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-300 p-8 md:p-12 space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] rotate-[-25deg] select-none text-8xl font-black uppercase text-slate-900">
            GOVT VERIFIED
          </div>

          <div className="border-b-2 border-slate-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-widest">
                <Building2 className="w-4 h-4" />
                Goods and Services Tax Network (GSTN)
              </div>
              <h1 className="text-2xl font-black text-slate-900">FORM GST REG-06</h1>
              <p className="text-xs font-semibold text-slate-600">
                Registration Certificate issued under Section 25 of the Central Goods and Services Tax Act, 2017
              </p>
            </div>

            <div className="bg-slate-100 border border-slate-300 p-3 rounded-xl text-right">
              <div className="text-[10px] text-slate-500 uppercase font-bold">GSTIN / UIN</div>
              <div className="text-base font-mono font-black text-sky-900">07AAACA1234F1Z5</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">● Status: Active</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              Part A: Principal Particulars
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">1. Legal Name:</span>
                <span className="font-bold text-sm text-slate-900">{vendorName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">2. Trade Name:</span>
                <span className="font-bold text-sm text-slate-900">Apex Technologies</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">3. Constitution of Business:</span>
                <span className="font-semibold text-slate-900">Private Limited Company</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">4. PAN Reference:</span>
                <span className="font-mono font-bold text-slate-900">AAACA1234F</span>
              </div>
              <div className="md:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">5. Address of Principal Place of Business:</span>
                <span className="font-medium text-slate-800">
                  Plot 42, Cyber Greens Tech Park, Barakhamba Road, Connaught Place, New Delhi, Delhi, 110001
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">6. Date of Liability:</span>
                <span className="font-medium text-slate-900">01/07/2017</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">7. Period of Validity:</span>
                <span className="font-medium text-slate-900">From 01/07/2017 to Regular / Perpetual</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Cryptographically Verified Document</div>
                <div className="text-[11px] text-slate-500 font-mono">SHA256: 8f9b4c2e6d1a0e5f7a3b9c8d1e2f3a4b</div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct Government Database Signature Matched
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-slate-800">Digitally Signed by Jurisdictional Authority</div>
              <div className="text-slate-500 text-[11px]">Department of Trade and Taxes, Ward 07, New Delhi</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Verified System Record</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DocumentViewerPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-slate-400 text-center">Loading Document Viewer...</div>}>
      <DocumentViewerContent />
    </React.Suspense>
  );
}