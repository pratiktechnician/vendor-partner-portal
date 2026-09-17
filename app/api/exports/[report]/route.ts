import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mockDb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ report: string }> }
) {
  const { report } = await params;

  let filename = 'export.csv';
  let dataRows: Record<string, any>[] = [];

  if (report === 'vendors') {
    filename = 'vendor_master.csv';
    dataRows = mockStore.organizations.filter((o) => o.entity_type === 'vendor');
  } else if (report === 'invoices') {
    filename = 'invoice_register.csv';
    dataRows = mockStore.invoices;
  } else if (report === 'payments') {
    filename = 'payment_register.csv';
    dataRows = mockStore.payments;
  } else {
    dataRows = mockStore.auditLogs;
    filename = 'audit_logs.csv';
  }

  if (!dataRows.length) {
    return NextResponse.json({ error: 'No records found' }, { status: 44 });
  }

  const headers = Object.keys(dataRows[0]);
  const csvText = [
    headers.join(','),
    ...dataRows.map((r) =>
      headers
        .map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n');

  return new NextResponse(csvText, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
