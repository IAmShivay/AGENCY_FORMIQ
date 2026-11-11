'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import {
  LogOut,
  Menu,
  X
, Loader2 } from 'lucide-react';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <div className="relative flex flex-col w-80 h-full bg-card backdrop-blur-md text-foreground overflow-hidden z-40 shadow-xl border-r border-border">
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-full bg-muted text-muted-foreground hover:bg-border lg:hidden"
          >
            <X size={18} />
          </button>

          {/* Sidebar Header with Modern Design */}
          <div className="relative px-8 py-8">

            <div className="relative flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
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
            <div className="p-4 bg-background rounded-2xl border border-border shadow-md">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-md">
                    <span className="text-primary-foreground text-lg font-semibold">{user?.email?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-border"></div>
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-primary">User Account</p>
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
                href="/user"
                className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-primary/80 rounded-xl transition-all duration-200 ${pathname === '/user' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'hover:bg-primary/5'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`p-1 mr-3 rounded-lg ${pathname === '/user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                  </svg>
                </div>
                <span>Dashboard</span>
              </Link>

              {/* My Services */}
              <Link
                href="/user/services"
                className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-primary/80 rounded-xl transition-all duration-200 ${pathname?.startsWith('/user/services') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'hover:bg-primary/5'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`p-1 mr-3 rounded-lg ${pathname?.startsWith('/user/services') ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <span>My Services</span>
              </Link>

              {/* Lead Management */}
              <Link
                href="/user/leads"
                className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-primary/80 rounded-xl transition-all duration-200 ${pathname?.startsWith('/user/leads') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'hover:bg-primary/5'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`p-1 mr-3 rounded-lg ${pathname?.startsWith('/user/leads') ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="m22 2-5 10-5-4-5 10"></path>
                    <path d="m16 12 5-10"></path>
                  </svg>
                </div>
                <span>Lead Management</span>
              </Link>

              {/* Profile */}
              <Link
                href="/user/profile"
                className={`group flex items-center px-4 py-3 text-muted-foreground hover:text-primary/80 rounded-xl transition-all duration-200 ${pathname === '/user/profile' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'hover:bg-primary/5'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`p-1 mr-3 rounded-lg ${pathname === '/user/profile' ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary group-hover:bg-primary/10'} transition-colors duration-200`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span>My Profile</span>
              </Link>

              {/* Back to Website */}
              <Link
                href="/"
                className="group flex items-center px-4 py-3 text-muted-foreground hover:text-primary/80 rounded-xl transition-all duration-200 hover:bg-primary/5"
                onClick={() => setSidebarOpen(false)}
              >
                <div className="p-1 mr-3 rounded-lg bg-muted text-primary group-hover:bg-primary/10 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <span>Back to Website</span>
              </Link>
            </nav>
          </div>

          {/* Sign Out Button with Modern AI-Era Styling */}
          <div className="px-6 py-6 border-t border-border">
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 group border border-red-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted/80 lg:hidden mr-3 transition-colors duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {pathname === '/user' && 'Dashboard'}
                  {pathname === '/user/profile' && 'My Profile'}
                  {pathname?.startsWith('/user/services') && 'My Services'}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href="/"
                target="_blank"
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors duration-200"
                title="View Website"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </a>
              <button
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors duration-200"
                title="Toggle Theme"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              <div className="relative">
                <button className="p-1 rounded-full bg-primary overflow-hidden shadow-md">
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
          <div className="relative">

            {/* Actual content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
