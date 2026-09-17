'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { DocumentPreviewModal } from '@/components/shared/DocumentPreviewModal';
import { mockStore } from '@/lib/supabase/mockDb';
import { DocumentItem } from '@/types';
import { Eye, FileCheck2, Filter } from 'lucide-react';

export default function DocumentReviewsPage() {
  const [documents, setDocuments] = React.useState<DocumentItem[]>(mockStore.documents);
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const handleOpenPreview = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleDocumentAction = (action: 'approve' | 'reject' | 'correction', comments: string) => {
    if (!selectedDoc) return;
    const nextStatus = action === 'approve' ? 'verified' : action === 'reject' ? 'rejected' : 'correction_required';

    setDocuments((prev) =>
      prev.map((d) => (d.id === selectedDoc.id ? { ...d, status: nextStatus, internal_comments: comments } : d))
    );

    mockStore.logAudit(`DOCUMENT_${action.toUpperCase()}`, 'document', selectedDoc.id, { status: selectedDoc.status }, { status: nextStatus, comments });
    alert(`Document review status updated to: ${nextStatus}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Document Verification Workspace</h1>
        <p className="text-xs text-slate-500 mt-1">Review uploaded vendor and customer compliance documents.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Verification Queue</CardTitle>
          <CardDescription>Click inspect to preview document and record review decisions.</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category / Title</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Inspection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-bold text-slate-900 dark:text-slate-100">{doc.category}</TableCell>
                  <TableCell className="text-xs font-mono text-slate-600 dark:text-slate-400">{doc.file_name}</TableCell>
                  <TableCell className="text-xs font-semibold">v{doc.version}</TableCell>
                  <TableCell>
                    <StatusBadge status={doc.status} type="document" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleOpenPreview(doc)}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Document
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DocumentPreviewModal
        document={selectedDoc}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onAction={handleDocumentAction}
      />
    </div>
  );
}
