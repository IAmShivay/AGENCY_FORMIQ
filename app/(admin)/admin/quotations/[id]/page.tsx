'use client';

import { use } from 'react';
import QuotationView from '@/components/admin/QuotationView';

interface QuotationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function QuotationPage(props: QuotationPageProps) {
  const params = use(props.params);
  return <QuotationView quotationId={params.id} />;
}
