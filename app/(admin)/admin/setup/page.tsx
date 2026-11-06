'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, AlertCircle , Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ADMIN_BTN_PRIMARY, ADMIN_CARD, ADMIN_CARD_PAD, ADMIN_EYEBROW, ADMIN_H2 } from '@/components/admin/admin-ui';

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/admin/setup');
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        if (data.isAdmin) {
          setSetupComplete(true);
          setTimeout(() => {
            router.push('/admin');
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error checking setup status:', error);
    }
  };

  const handleSetupAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setSetupComplete(true);
        setUserInfo(data.user);
        
        setTimeout(() => {
          router.push('/admin');
        }, 3000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to setup admin');
      }
    } catch (error) {
      console.error('Error setting up admin:', error);
      toast.error('Failed to setup admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (setupComplete) {
    return (
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow="Account"
          title="Setup complete"
          description="Your admin account is configured."
        />
        <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} mx-auto w-full max-w-md text-center`}>
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-success/30 bg-success/10">
            <CheckCircle className="h-7 w-7 text-success" />
          </div>
          <h2 className={`${ADMIN_H2} mb-3`}>
            Setup complete
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Your admin account has been successfully configured. You now have full access to the FormiqStudio admin panel.
          </p>
          <div className="mb-6 space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-left">
            <p className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-foreground">
              <span className={ADMIN_EYEBROW}>Admin user</span>
              <span className="break-all">{userInfo?.full_name || userInfo?.email}</span>
            </p>
            <p className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-foreground">
              <span className={ADMIN_EYEBROW}>Role</span>
              <span>{userInfo?.role}</span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Redirecting to admin dashboard in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Account"
        title="Admin setup"
        description="Complete your admin account setup to access the lead management system."
      />
      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} mx-auto w-full max-w-md`}>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-foreground">
            <Shield className="h-7 w-7 text-background" />
          </div>
          <h2 className={ADMIN_H2}>
            FormiqStudio admin setup
          </h2>
        </div>

        <div className="mb-8 space-y-6">
          <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-primary">Admin privileges</h3>
              <p className="mt-1 text-sm text-foreground/80">
                You'll get access to lead management, employee assignment, performance analytics, and all admin features.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className={ADMIN_EYEBROW}>What you'll get</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                Full lead management system
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                AI-powered proposal generation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                Employee performance analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                Email system with templates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                Complete admin dashboard
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleSetupAdmin}
          disabled={loading}
          className={`${ADMIN_BTN_PRIMARY} h-11 w-full`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            'Set up admin account'
          )}
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          This will configure your account with admin privileges for FormiqStudio
        </p>
      </div>
    </div>
  );
}
