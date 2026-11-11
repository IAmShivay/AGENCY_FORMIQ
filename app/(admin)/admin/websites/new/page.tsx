'use client';

import WebsiteForm from '@/components/admin/WebsiteForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ADMIN_CARD, ADMIN_CARD_PAD } from '@/components/admin/admin-ui';

export default function NewWebsitePage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Websites" title="New website" description="Add a new website to the portfolio." />

      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
        <WebsiteForm />
      </div>
    </div>
  );
}
