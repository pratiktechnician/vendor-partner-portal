'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FileUploader } from '@/components/shared/FileUploader';

export default function CustomerDocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Agreements & Compliance Documents</h1>
        <p className="text-xs text-slate-500 mt-1">Upload executed Master Services Agreements and tax certificates.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Signed Master Services Agreement</TableCell>
                <TableCell className="font-mono text-xs text-slate-500">Horizon_MSA_Executed.pdf</TableCell>
                <TableCell><StatusBadge status="approved" type="document" /></TableCell>
                <TableCell className="text-right">
                  <FileUploader label="" onUploadSuccess={() => alert('New agreement copy uploaded for verification.')} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
