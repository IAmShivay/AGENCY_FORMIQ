'use client';

import WebsiteForm from '@/components/admin/WebsiteForm';

export default function NewWebsitePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add New Website</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Fill in the details to add a new website to your portfolio</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <WebsiteForm />
      </div>
    </div>
  );
}
