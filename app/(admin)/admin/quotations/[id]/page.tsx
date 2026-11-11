'use client';

import { use } from 'react';
import QuotationView from '@/components/admin/QuotationView';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

interface QuotationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function QuotationPage(props: QuotationPageProps) {
  const params = use(props.params);
  return (
    <div className="space-y-8">
      <div className="print:hidden">
        <AdminPageHeader eyebrow="Quotations" title="Quotation" description="Review, share and print this quotation." />
      </div>
      <QuotationView quotationId={params.id} />
    </div>
  );
}
