'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SignatureManager from '@/components/admin/SignatureManager';

export default function SignaturesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Clients"
        title="Digital signatures"
        description="Manage the digital signatures used on quotations."
      />
      <SignatureManager />
    </div>
  );
}
