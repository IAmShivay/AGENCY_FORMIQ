'use client';

import BlogForm from '@/components/admin/BlogForm';

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create New Blog Post</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Fill in the details to create a new blog post</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <BlogForm />
      </div>
    </div>
  );
}
