'use client';

import AuthorForm from '@/components/admin/AuthorForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ADMIN_CARD, ADMIN_CARD_PAD } from '@/components/admin/admin-ui';

export default function NewAuthorPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Authors" title="New author" description="Add a new author to the blog." />

      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
        <AuthorForm />
      </div>
    </div>
  );
}
