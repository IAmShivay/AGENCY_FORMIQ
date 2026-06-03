'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  X,
  Users,
  Activity,
  UserCheck,
  FileText,
  Settings,
  PenTool,
  Loader2,
} from 'lucide-react';
import { Toaster } from 'sonner';
import { DashboardThemeProvider, useDashboardTheme } from '@/components/DashboardThemeProvider';
// ThemeSwitcher removed - using light mode only
import useAuth from '@/hooks/useAuth';
import RoleManager from '@/lib/auth/roleManager';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Use centralized authentication with admin/manager role requirement
  const {
    user,
    roles,
    loading,
    isAuthenticated,
    canAccessAdminDashboard,
    signOut
  } = useAuth(true, true); // Require auth and admin/manager access

  // Get tab access permissions
  const tabAccess = roles ? RoleManager.getTabAccess(roles) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle - only shown when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed z-50 bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground lg:hidden shadow-xl hover:bg-primary/90 transition-colors duration-200"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 z-40 transition duration-300 ease-in-out`}
      >
        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/50 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <div className="relative flex flex-col w-80 h-full bg-card text-card-foreground overflow-hidden z-40 shadow-xl border-r border-border">
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 lg:hidden"
          >
            <X size={18} />
          </button>

          {/* Sidebar Header with Modern Design */}
          <div className="relative px-8 py-8">
            <div className="relative flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
                  <path d="M12 8v4l3 3"></path>
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-foreground">FormiqStudio</h1>
                <p className="text-xs text-primary">Crafting infinite digital experiences</p>
              </div>
            </div>
          </div>

          {/* User Profile with Modern Design */}
          <div className="relative mx-6 mb-8">
            <div className="p-4 bg-secondary/50 rounded-2xl border border-border shadow-md">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-accent to-accent flex items-center justify-center shadow-md">
                    <span className="text-white text-lg font-semibold">{user?.email?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-card"></div>
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-primary">
                      {roles ? RoleManager.getRoleDisplayName(roles) : 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation with Modern AI-Era Styling */}
          <div className="flex-grow px-4 pb-8 overflow-auto">
            <nav className="space-y-1">
              {/* Dashboard */}
              <Link
                href="/admin"
                className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname === '/admin' ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`p-1 mr-3 rounded-lg ${pathname === '/admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                  {/* Modern Dashboard Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                  </svg>
                </div>
                <span>Dashboard</span>
              </Link>

              {/* Content Management - Admin Only */}
              {tabAccess?.blogs && (
                <>
                  <div className="mt-8 mb-4 px-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content Management</h3>
                  </div>
                  <Link
                    href="/admin/blogs"
                    className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/blogs') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`p-1 mr-3 rounded-lg ${pathname?.startsWith('/admin/blogs') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                      {/* Modern Blog Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                        <path d="M2 2l7.586 7.586"></path>
                        <circle cx="11" cy="11" r="2"></circle>
                      </svg>
                    </div>
                    <span>Blog Posts</span>
                  </Link>
                </>
              )}

              {tabAccess?.authors && (
                <Link
                  href="/admin/authors"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/authors') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname.startsWith('/admin/authors') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    {/* Modern Authors Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <span>Authors</span>
                </Link>
              )}

              {/* Lead Management - Admin and Manager Access */}
              {(tabAccess?.leads || tabAccess?.employees || tabAccess?.activities) && (
                <div className="mt-8 mb-4 px-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lead Management</h3>
                </div>
              )}

              {tabAccess?.leads && (
                <Link
                  href="/admin/leads"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/leads') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname?.startsWith('/admin/leads') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span>Leads</span>
                </Link>
              )}

              {/* Quotations - Admin/Manager Access */}
              {canAccessAdminDashboard && (
                <Link
                  href="/admin/quotations"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/quotations') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname?.startsWith('/admin/quotations') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <span>Quotations</span>
                </Link>
              )}

              {/* Terms & Conditions - Admin/Manager Access */}
              {canAccessAdminDashboard && (
                <Link
                  href="/admin/terms"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/terms') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname?.startsWith('/admin/terms') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    <Settings className="w-5 h-5" />
                  </div>
                  <span>Terms & Conditions</span>
                </Link>
              )}

              {/* Digital Signatures - Admin/Manager Access */}
              {canAccessAdminDashboard && (
                <Link
                  href="/admin/signatures"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/signatures') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname?.startsWith('/admin/signatures') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    <PenTool className="w-5 h-5" />
                  </div>
                  <span>Digital Signatures</span>
                </Link>
              )}

              {tabAccess?.employees && (
                <Link
                  href="/admin/employees"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/employees') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname?.startsWith('/admin/employees') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <span>Employees</span>
                </Link>
              )}

              {tabAccess?.activities && (
                <Link
                  href="/admin/activities"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/activities') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname?.startsWith('/admin/activities') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <span>Activities</span>
                </Link>
              )}

              {/* Portfolio Management - Admin Only */}
              {(tabAccess?.portfolioWebsites || tabAccess?.portfolioApps || tabAccess?.portfolioDesigns) && (
                <div className="mt-8 mb-4 px-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Portfolio</h3>
                </div>
              )}

              {tabAccess?.portfolioWebsites && (
                <Link
                  href="/admin/portfolio/websites"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/portfolio/websites') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname.startsWith('/admin/portfolio/websites') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    {/* Modern Website Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <span>Websites</span>
                </Link>
              )}

              {tabAccess?.portfolioApps && (
                <Link
                  href="/admin/portfolio/apps"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/portfolio/apps') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname.startsWith('/admin/portfolio/apps') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    {/* Modern App Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <span>Applications</span>
                </Link>
              )}

              {tabAccess?.portfolioDesigns && (
                <Link
                  href="/admin/portfolio/designs"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/portfolio/designs') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname.startsWith('/admin/portfolio/designs') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    {/* Modern Design Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="4"></circle>
                      <line x1="21.17" y1="8" x2="12" y2="8"></line>
                      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                    </svg>
                  </div>
                  <span>Designs</span>
                </Link>
              )}

              {/* System Management - Admin and Manager Access */}
              {(tabAccess?.messages || tabAccess?.system) && (
                <div className="mt-8 mb-4 px-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</h3>
                </div>
              )}

              {tabAccess?.messages && (
                <Link
                  href="/admin/messages"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/messages') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname.startsWith('/admin/messages') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    {/* Messages Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <span>Contact Messages</span>
                </Link>
              )}

              {tabAccess?.system && (
                <Link
                  href="/admin/system"
                  className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200 ${pathname?.startsWith('/admin/system') ? 'bg-primary/10 text-foreground border-l-4 border-primary' : 'hover:bg-secondary/50'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-1 mr-3 rounded-lg ${pathname.startsWith('/admin/system') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                    {/* System Health Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <span>System Health</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Sign Out Button with Modern AI-Era Styling */}
          <div className="px-6 py-6 border-t border-border">
            <button
              onClick={signOut}
              className="flex items-center justify-center w-full px-4 py-3 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 group border border-red-100 dark:border-red-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-background">
        {/* Top header with modern AI-era styling */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-secondary/80 lg:hidden mr-3 transition-colors duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {pathname === '/admin' && 'Dashboard'}
                  {pathname?.startsWith('/admin/blogs') && 'Blog Management'}
                  {pathname?.startsWith('/admin/authors') && 'Author Management'}
                  {pathname?.startsWith('/admin/quotations') && 'Quotation Management'}
                  {pathname?.startsWith('/admin/terms') && 'Terms & Conditions'}
                  {pathname?.startsWith('/admin/signatures') && 'Digital Signatures'}
                  {pathname?.startsWith('/admin/portfolio/websites') && 'Website Projects'}
                  {pathname?.startsWith('/admin/portfolio/apps') && 'App Projects'}
                  {pathname?.startsWith('/admin/portfolio/designs') && 'Design Projects'}
                  {pathname?.startsWith('/admin/messages') && 'Contact Messages'}
                  {pathname?.startsWith('/admin/system') && 'System Health'}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative p-1.5 rounded-lg bg-secondary hidden sm:flex items-center mr-2">
                <svg className="w-4 h-4 text-muted-foreground absolute left-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-7 pr-3 py-1 bg-transparent border-none outline-none text-sm w-40 text-foreground placeholder-muted-foreground"
                />
              </div>
              <a
                href="/"
                target="_blank"
                className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors duration-200"
                title="View Website"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </a>
              {/* Theme toggle removed - using light mode only */}
              <div className="relative">
                <button className="p-1 rounded-full bg-gradient-to-br from-primary via-accent to-accent overflow-hidden shadow-md">
                  <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center border-2 border-transparent">
                    <span className="text-primary text-sm font-semibold">{user?.email?.charAt(0).toUpperCase()}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area with modern AI-era styling */}
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  );
}
