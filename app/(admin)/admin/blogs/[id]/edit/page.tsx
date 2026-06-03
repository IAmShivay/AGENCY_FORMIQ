'use client';

import { use } from 'react';
import BlogForm from '@/components/admin/BlogForm';

export default function EditBlogPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Blog Post</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Update the details of your blog post</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <BlogForm postId={params.id} />
      </div>
    </div>
  );
}
