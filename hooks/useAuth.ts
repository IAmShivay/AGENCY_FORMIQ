import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import RoleManager, { UserRole } from '@/lib/auth/roleManager';

export interface AuthState {
  user: any | null;
  roles: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasAdminAccess: boolean;
  hasManagerAccess: boolean;
  hasEmployeeAccess: boolean;
  canAccessAdminDashboard: boolean;
}

/**
 * Centralized authentication hook with role-based access control
 */
export function useAuth(requireAuth: boolean = false, requireAdminOrManager: boolean = false) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    roles: null,
    loading: true,
    isAuthenticated: false,
    hasAdminAccess: false,
    hasManagerAccess: false,
    hasEmployeeAccess: false,
    canAccessAdminDashboard: false,
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await RoleManager.checkAuthAndRoles();

        if (!authData) {
          if (requireAuth) {
            router.push('/login');
            return;
          }
          setAuthState({
            user: null,
            roles: null,
            loading: false,
            isAuthenticated: false,
            hasAdminAccess: false,
            hasManagerAccess: false,
            hasEmployeeAccess: false,
            canAccessAdminDashboard: false,
          });
          return;
        }

        const { user, roles } = authData;

        // Check if user meets admin or manager requirement
        if (requireAdminOrManager) {
          const hasRequiredAccess = RoleManager.hasAdminDashboardAccess(roles);

          if (!hasRequiredAccess) {
            console.log('User does not have admin or manager access, redirecting');
            router.push(RoleManager.getDashboardRoute(roles));
            return;
          }
        }

        setAuthState({
          user,
          roles,
          loading: false,
          isAuthenticated: true,
          hasAdminAccess: RoleManager.hasAdminAccess(roles),
          hasManagerAccess: RoleManager.hasManagerAccess(roles),
          hasEmployeeAccess: RoleManager.hasEmployeeAccess(roles),
          canAccessAdminDashboard: RoleManager.hasAdminDashboardAccess(roles),
        });

      } catch (error) {
        console.error('Error in auth check:', error);
        if (requireAuth) {
          router.push('/login');
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            roles: null,
            loading: false,
            isAuthenticated: false,
            hasAdminAccess: false,
            hasManagerAccess: false,
            hasEmployeeAccess: false,
            canAccessAdminDashboard: false,
          });
        } else if (event === 'SIGNED_IN' && session) {
          // Re-check auth when user signs in
          checkAuth();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [requireAuth, requireAdminOrManager, router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    ...authState,
    signOut,
    refresh: () => {
      setAuthState(prev => ({ ...prev, loading: true }));
      // Trigger re-check by updating a dependency
    }
  };
}

export default useAuth;
