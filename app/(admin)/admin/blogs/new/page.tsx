'use client';

import BlogForm from '@/components/admin/BlogForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ADMIN_CARD, ADMIN_CARD_PAD } from '@/components/admin/admin-ui';

export default function NewBlogPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Blog posts" title="New post" description="Fill in the details to create a new blog post." />

      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
        <BlogForm />
      </div>
    </div>
  );
}
