'use client';

import AppForm from '@/components/admin/AppForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ADMIN_CARD, ADMIN_CARD_PAD } from '@/components/admin/admin-ui';

export default function NewAppPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Apps" title="New app" description="Add a new application to the portfolio." />

      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
        <AppForm />
      </div>
    </div>
  );
}
