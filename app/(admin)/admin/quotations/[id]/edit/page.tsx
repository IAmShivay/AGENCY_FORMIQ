'use client';

import { use } from 'react';
import QuotationForm from '@/components/admin/QuotationForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

interface EditQuotationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditQuotationPage(props: EditQuotationPageProps) {
  const params = use(props.params);
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Quotations"
        title="Edit quotation"
        description="Update the quotation details for your client."
      />
      <QuotationForm quotationId={params.id} />
    </div>
  );
}
