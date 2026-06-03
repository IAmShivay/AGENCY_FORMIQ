'use client';

import AppForm from '@/components/admin/AppForm';

export default function NewAppPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add New App</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Fill in the details to add a new application to your portfolio</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <AppForm />
      </div>
    </div>
  );
}
