'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MOCK_VENDORS, MOCK_APPROVALS, MOCK_DOCUMENTS, MOCK_TICKETS } from '@/lib/supabase/mockDb';
import { Vendor360ProfileView } from '@/components/vendor/Vendor360ProfileView';

export default function Vendor360DetailsPage() {
  const params = useParams();
  const id = (params?.id as string) || 'vp-01';

  const vendor = MOCK_VENDORS.find((v) => v.id === id || v.organization_id === id) || MOCK_VENDORS[0];
  const approvals = MOCK_APPROVALS.find((a) => a.vendor_id === vendor.id) || MOCK_APPROVALS[0];
  const documents = MOCK_DOCUMENTS.filter((d) => d.organization_id === vendor.organization_id);
  const tickets = MOCK_TICKETS.filter((t) => t.organization_id === vendor.organization_id);

  return (
    <div className="space-y-6">
      <Vendor360ProfileView
        vendor={vendor}
        approvals={approvals}
        documents={documents}
        invoices={[]}
        tickets={tickets}
      />
    </div>
  );
}
