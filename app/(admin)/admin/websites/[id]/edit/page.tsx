'use client';

import { use } from 'react';
import WebsiteForm from '@/components/admin/WebsiteForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ADMIN_CARD, ADMIN_CARD_PAD } from '@/components/admin/admin-ui';

export default function EditWebsitePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Websites" title="Edit website" description="Update the details of this website project." />

      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
        <WebsiteForm websiteId={params.id} />
      </div>
    </div>
  );
}
