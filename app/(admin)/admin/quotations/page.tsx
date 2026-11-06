'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import QuotationsList from '@/components/admin/QuotationsList';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ADMIN_BTN_PRIMARY } from '@/components/admin/admin-ui';

export default function QuotationsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Clients"
        title="Quotations"
        description="Manage your project quotations and proposals."
        actions={
          <Link href="/admin/quotations/new" className={ADMIN_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            New quotation
          </Link>
        }
      />
      <QuotationsList />
    </div>
  );
}
