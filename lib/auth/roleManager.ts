import { supabase } from '@/lib/supabaseClient';

export interface UserRole {
  is_admin: boolean;
  is_employee: boolean;
  is_manager: boolean;
  full_name?: string;
  email?: string;
}

export interface TabAccess {
  dashboard: boolean;
  blogs: boolean;
  authors: boolean;
  leads: boolean;
  employees: boolean;
  activities: boolean;
  portfolioWebsites: boolean;
  portfolioApps: boolean;
  portfolioDesigns: boolean;
  messages: boolean;
  system: boolean;
}

/**
 * Centralized role-based access management system
 */
export class RoleManager {
  /**
   * Get user roles from database using direct Supabase client API
   */
  static async getUserRoles(userId: string): Promise<UserRole | null> {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('is_admin, is_employee, is_manager, full_name, email')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user roles:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error in getUserRoles:', error);
      return null;
    }
  }

  /**
   * Check if user has admin access
   */
  static hasAdminAccess(roles: UserRole): boolean {
    return roles.is_admin === true;
  }

  /**
   * Check if user has manager access
   */
  static hasManagerAccess(roles: UserRole): boolean {
    return roles.is_manager === true;
  }

  /**
   * Check if user has employee access
   */
  static hasEmployeeAccess(roles: UserRole): boolean {
    return roles.is_employee === true;
  }

  /**
   * Check if user has admin or manager access (for admin dashboard access)
   */
  static hasAdminDashboardAccess(roles: UserRole): boolean {
    return this.hasAdminAccess(roles) || this.hasManagerAccess(roles);
  }

  /**
   * Get tab access permissions based on user roles
   */
  static getTabAccess(roles: UserRole): TabAccess {
    const isAdmin = this.hasAdminAccess(roles);
    const isManager = this.hasManagerAccess(roles);
    const isEmployee = this.hasEmployeeAccess(roles);

    return {
      // Dashboard access for all authenticated users
      dashboard: true,
      
      // Content management - Admin only
      blogs: isAdmin,
      authors: isAdmin,
      
      // Lead management - Admin and Manager
      leads: isAdmin || isManager,
      
      // Employee management - Admin only
      employees: isAdmin,
      
      // Activities - Admin and Manager
      activities: isAdmin || isManager,
      
      // Portfolio management - Admin only
      portfolioWebsites: isAdmin,
      portfolioApps: isAdmin,
      portfolioDesigns: isAdmin,
      
      // Contact messages - Admin and Manager
      messages: isAdmin || isManager,
      
      // System management - Admin only
      system: isAdmin,
    };
  }

  /**
   * Get appropriate dashboard route based on user roles
   */
  static getDashboardRoute(roles: UserRole): string {
    if (this.hasAdminDashboardAccess(roles)) {
      return '/admin';
    }
    return '/user';
  }

  /**
   * Validate access to a specific route
   */
  static canAccessRoute(roles: UserRole, route: string): boolean {
    const tabAccess = this.getTabAccess(roles);
    
    // Map routes to tab access permissions
    const routePermissions: Record<string, keyof TabAccess> = {
      '/admin': 'dashboard',
      '/admin/blogs': 'blogs',
      '/admin/authors': 'authors',
      '/admin/leads': 'leads',
      '/admin/employees': 'employees',
      '/admin/activities': 'activities',
      '/admin/portfolio/websites': 'portfolioWebsites',
      '/admin/portfolio/apps': 'portfolioApps',
      '/admin/portfolio/designs': 'portfolioDesigns',
      '/admin/messages': 'messages',
      '/admin/system': 'system',
    };

    // Check if route starts with any of the defined routes
    for (const [routePattern, permission] of Object.entries(routePermissions)) {
      if (route.startsWith(routePattern)) {
        return tabAccess[permission];
      }
    }

    // Default to allowing access for unmatched routes
    return true;
  }

  /**
   * Get user role display name
   */
  static getRoleDisplayName(roles: UserRole): string {
    if (this.hasAdminAccess(roles)) {
      return 'Administrator';
    }
    if (this.hasManagerAccess(roles)) {
      return 'Manager';
    }
    if (this.hasEmployeeAccess(roles)) {
      return 'Employee';
    }
    return 'User';
  }

  /**
   * Check authentication and roles with retry logic
   */
  static async checkAuthAndRoles(maxRetries: number = 3): Promise<{
    user: any;
    roles: UserRole;
  } | null> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error('Authentication error:', authError);
          return null;
        }

        // Get user roles
        const roles = await this.getUserRoles(user.id);
        
        if (!roles) {
          console.warn(`Role fetch attempt ${attempt + 1} failed`);
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          return null;
        }

        return { user, roles };
      } catch (error) {
        console.error(`Auth check attempt ${attempt + 1} failed:`, error);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    return null;
  }
}

export default RoleManager;
