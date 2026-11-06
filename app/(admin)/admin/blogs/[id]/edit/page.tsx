'use client';

import { use } from 'react';
import BlogForm from '@/components/admin/BlogForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ADMIN_CARD, ADMIN_CARD_PAD } from '@/components/admin/admin-ui';

export default function EditBlogPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Blog posts" title="Edit post" description="Update the details of this blog post." />

      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
        <BlogForm postId={params.id} />
      </div>
    </div>
  );
}
