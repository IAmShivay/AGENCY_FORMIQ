'use client';

import { use } from 'react';
import QuotationForm from '@/components/admin/QuotationForm';

interface EditQuotationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditQuotationPage(props: EditQuotationPageProps) {
  const params = use(props.params);
  return <QuotationForm quotationId={params.id} />;
}
