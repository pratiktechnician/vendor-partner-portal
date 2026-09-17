'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { DocumentItem } from '@/types';
import { CheckCircle2, XCircle, AlertTriangle, FileText, Download, ExternalLink } from 'lucide-react';
import { formatDate, formatFileSize } from '@/lib/utils/formatters';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: 'approve' | 'reject' | 'correction', comments: string) => void;
}

export function DocumentPreviewModal({
  document,
  isOpen,
  onClose,
  onAction,
}: DocumentPreviewModalProps) {
  const [comments, setComments] = React.useState('');
  const [rejectionError, setRejectionError] = React.useState(false);

  if (!document) return null;

  const handleAction = (action: 'approve' | 'reject' | 'correction') => {
    if ((action === 'reject' || action === 'correction') && !comments.trim()) {
      setRejectionError(true);
      return;
    }
    setRejectionError(false);
    if (onAction) {
      onAction(action, comments);
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={document.category}
      description={`Version ${document.version} • Uploaded ${formatDate(document.created_at)}`}
      maxWidth="4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document Viewer Frame */}
        <div className="md:col-span-2 bg-slate-100 dark:bg-slate-950 rounded-xl p-4 min-h-[350px] flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4 shadow-inner">
            <FileText className="w-8 h-8" />
          </div>

          <p className="font-bold text-slate-800 dark:text-slate-100 text-center">{document.file_name}</p>
          <p className="text-xs text-slate-500 mt-1">{formatFileSize(document.file_size)} • {document.mime_type}</p>

          <div className="flex items-center gap-3 mt-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`Simulated signed URL download for: ${document.storage_path}`);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download Original
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`Opening signed viewer URL in secure popup frame.`);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Preview
            </a>
          </div>
        </div>

        {/* Verification Sidebar */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Current Status</p>
              <div className="mt-1">
                <StatusBadge status={document.status} type="document" />
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <p><strong className="text-slate-700 dark:text-slate-300">Issue Date:</strong> {formatDate(document.issue_date)}</p>
              <p><strong className="text-slate-700 dark:text-slate-300">Expiry Date:</strong> {formatDate(document.expiry_date)}</p>
              <p><strong className="text-slate-700 dark:text-slate-300">File Path:</strong> <code className="text-[10px] text-sky-600">{document.storage_path}</code></p>
            </div>

            {onAction && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Reviewer Notes / Rejection Reason
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => {
                    setComments(e.target.value);
                    if (e.target.value) setRejectionError(false);
                  }}
                  placeholder="Enter feedback or mandatory rejection reason..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 outline-none"
                />
                {rejectionError && (
                  <p className="text-[11px] text-rose-600 font-semibold">
                    * Comments are required when rejecting or requesting correction.
                  </p>
                )}
              </div>
            )}
          </div>

          {onAction && (
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                onClick={() => handleAction('approve')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-bold"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Document
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleAction('correction')}
                  variant="outline"
                  className="w-full text-amber-600 border-amber-300 hover:bg-amber-50 text-xs font-semibold"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Correction Needed
                </Button>
                <Button
                  onClick={() => handleAction('reject')}
                  variant="destructive"
                  className="w-full text-xs font-semibold"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
