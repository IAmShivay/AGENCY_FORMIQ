'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, AlertCircle , Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
          // Redirect to admin dashboard after 3 seconds
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
        
        // Redirect to admin dashboard after 3 seconds
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Setup Complete!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your admin account has been successfully configured. You now have full access to the FormiqStudio admin panel.
          </p>
          <div className="bg-secondary/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Admin User:</strong> {userInfo?.full_name || userInfo?.email}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Role:</strong> {userInfo?.role}
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            FormiqStudio Admin Setup
          </h1>
          <p className="text-muted-foreground">
            Complete your admin account setup to access the lead management system
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-primary">Admin Privileges</h3>
              <p className="text-sm text-primary/80">
                You'll get access to lead management, employee assignment, performance analytics, and all admin features.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-foreground">What you'll get:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Full lead management system
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                AI-powered proposal generation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Employee performance analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Email system with templates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Complete admin dashboard
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleSetupAdmin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-lg font-medium hover:from-primary/90 hover:to-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              Setting up...
            </div>
          ) : (
            'Setup Admin Account'
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          This will configure your account with admin privileges for FormiqStudio
        </p>
      </div>
    </div>
  );
}
