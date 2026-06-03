'use client';

import { use } from 'react';
import AppForm from '@/components/admin/AppForm';

export default function EditAppPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit App</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Update the details of your application project</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <AppForm appId={params.id} />
      </div>
    </div>
  );
}
