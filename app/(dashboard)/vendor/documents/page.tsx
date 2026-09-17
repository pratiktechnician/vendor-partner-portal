'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FileUploader } from '@/components/shared/FileUploader';
import { mockStore } from '@/lib/supabase/mockDb';
import { DocumentItem } from '@/types';
import { formatDate } from '@/lib/utils/formatters';

export default function VendorDocumentsPage() {
  const [documents, setDocuments] = React.useState<DocumentItem[]>(mockStore.documents);

  const handleUploadNewVersion = (category: string, path: string) => {
    const existing = documents.find((d) => d.category === category);
    if (existing) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === existing.id
            ? { ...d, version: d.version + 1, status: 'uploaded' as const, storage_path: path }
            : d
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Statutory Compliance Documents</h1>
        <p className="text-xs text-slate-500 mt-1">Upload and replace required compliance certificates.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Category</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Resubmit / Replace</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-bold text-slate-900 dark:text-slate-100">{doc.category}</TableCell>
                  <TableCell className="text-xs font-mono text-slate-600 dark:text-slate-400">{doc.file_name}</TableCell>
                  <TableCell className="text-xs font-bold">v{doc.version}</TableCell>
                  <TableCell className="text-xs">{formatDate(doc.expiry_date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={doc.status} type="document" />
                  </TableCell>
                  <TableCell className="text-right">
                    <FileUploader
                      label=""
                      onUploadSuccess={(meta) => handleUploadNewVersion(doc.category, meta.path)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
