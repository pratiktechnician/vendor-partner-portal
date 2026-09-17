'use client';

import * as React from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { formatFileSize } from '@/lib/utils/formatters';

interface FileUploaderProps {
  label: string;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  onUploadSuccess: (fileMeta: { name: string; path: string; size: number; mime: string }) => void;
}

export function FileUploader({
  label,
  acceptedTypes = ['.pdf', '.png', '.jpg', '.jpeg'],
  maxSizeMB = 15,
  onUploadSuccess,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<{ name: string; size: number; path: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError(null);

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (acceptedTypes.length && !acceptedTypes.includes(ext)) {
      setError(`Invalid file type. Allowed formats: ${acceptedTypes.join(', ')}`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum threshold of ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);

    // Mock upload path creation
    setTimeout(() => {
      const mockPath = `uploads/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const meta = { name: file.name, size: file.size, path: mockPath, mime: file.type || 'application/pdf' };
      setUploadedFile(meta);
      setIsUploading(false);
      onUploadSuccess(meta);
    }, 600);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>

      {uploadedFile ? (
        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{uploadedFile.name}</p>
              <p className="text-[11px] text-slate-500">{formatFileSize(uploadedFile.size)} • Uploaded</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUploadedFile(null)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/50'
          }`}
        >
          <input
            type="file"
            onChange={(e) => handleFiles(e.target.files)}
            accept={acceptedTypes.join(',')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center gap-1.5 pointer-events-none">
            <Upload className={`w-6 h-6 ${isUploading ? 'animate-bounce text-sky-600' : 'text-slate-400'}`} />
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {isUploading ? 'Uploading file...' : 'Drag & drop file or click to browse'}
            </p>
            <p className="text-[11px] text-slate-400">
              Supported: {acceptedTypes.join(', ')} (Max {maxSizeMB}MB)
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
