'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import TermsConditionsManager from '@/components/admin/TermsConditionsManager';

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Clients"
        title="Terms and conditions"
        description="Manage the terms and conditions templates used on quotations."
      />
      <TermsConditionsManager />
    </div>
  );
}
