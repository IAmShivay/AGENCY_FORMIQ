'use client';

import { use } from 'react';
import AuthorForm from '@/components/admin/AuthorForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ADMIN_CARD, ADMIN_CARD_PAD } from '@/components/admin/admin-ui';

export default function EditAuthorPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Authors" title="Edit author" description="Update this author's information." />

      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
        <AuthorForm authorId={params.id} />
      </div>
    </div>
  );
}
