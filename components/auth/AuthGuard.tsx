'use client';
import { Loader2 } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import RoleManager, { UserRole } from '@/lib/auth/roleManager';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdminOrManager?: boolean;
  requireAdmin?: boolean;
  requireManager?: boolean;
  requireEmployee?: boolean;
  fallbackRoute?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * AuthGuard component for protecting routes and components based on user roles
 */
export default function AuthGuard({
  children,
  requireAuth = false,
  requireAdminOrManager = false,
  requireAdmin = false,
  requireManager = false,
  requireEmployee = false,
  fallbackRoute,
  loadingComponent
}: AuthGuardProps) {
  const router = useRouter();
  const { user, roles, loading, isAuthenticated } = useAuth(requireAuth, requireAdminOrManager);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(fallbackRoute || '/login');
      return;
    }

    // Check role requirements
    if (roles) {
      let hasRequiredRole = true;

      if (requireAdmin && !RoleManager.hasAdminAccess(roles)) {
        hasRequiredRole = false;
      }

      if (requireManager && !RoleManager.hasManagerAccess(roles)) {
        hasRequiredRole = false;
      }

      if (requireEmployee && !RoleManager.hasEmployeeAccess(roles)) {
        hasRequiredRole = false;
      }

      if (requireAdminOrManager && !RoleManager.hasAdminDashboardAccess(roles)) {
        hasRequiredRole = false;
      }

      if (!hasRequiredRole) {
        const redirectRoute = fallbackRoute || RoleManager.getDashboardRoute(roles);
        router.push(redirectRoute);
        return;
      }
    }

    setAccessGranted(true);
  }, [
    loading, 
    isAuthenticated, 
    roles, 
    requireAuth, 
    requireAdmin, 
    requireManager, 
    requireEmployee, 
    requireAdminOrManager,
    fallbackRoute,
    router
  ]);

  // Show loading state
  if (loading) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Show children only if access is granted
  if (accessGranted) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}

/**
 * Higher-order component for protecting pages
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<AuthGuardProps, 'children'>
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...guardProps}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
