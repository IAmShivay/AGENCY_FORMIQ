'use client';

import AuthorForm from '@/components/admin/AuthorForm';

export default function NewAuthorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create New Author</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Add a new author to your blog</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <AuthorForm />
      </div>
    </div>
  );
}
