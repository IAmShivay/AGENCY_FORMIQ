'use client';

import QuotationForm from '@/components/admin/QuotationForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function NewQuotationPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Quotations"
        title="New quotation"
        description="Create a professional quotation for your client."
      />
      <QuotationForm />
    </div>
  );
}
