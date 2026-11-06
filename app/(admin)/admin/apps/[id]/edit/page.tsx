'use client';

import { use } from 'react';
import AppForm from '@/components/admin/AppForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ADMIN_CARD, ADMIN_CARD_PAD } from '@/components/admin/admin-ui';

export default function EditAppPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Apps" title="Edit app" description="Update the details of this application project." />

      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
        <AppForm appId={params.id} />
      </div>
    </div>
  );
}
