'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SystemHealth from '@/components/admin/SystemHealth';

export default function SystemHealthPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="System"
        title="System health"
        description="Monitor system performance and resource usage."
      />
      <SystemHealth />
    </div>
  );
}
