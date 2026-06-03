'use client';

import { use } from 'react';
import WebsiteForm from '@/components/admin/WebsiteForm';

export default function EditWebsitePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Website</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Update the details of your website project</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <WebsiteForm websiteId={params.id} />
      </div>
    </div>
  );
}
