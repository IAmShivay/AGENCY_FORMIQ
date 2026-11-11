'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  Briefcase,
  AppWindow,
  BarChart3,
  CreditCard,
  ExternalLink,
  FileSignature,
  FileText,
  Globe,
  HeartPulse,
  ImageIcon,
  LayoutGrid,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Palette,
  PenTool,
  ScrollText,
  UserCheck,
  Users,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Toaster } from 'sonner';
import useAuth from '@/hooks/useAuth';
import RoleManager from '@/lib/auth/roleManager';
import Wordmark from '@/components/studio/Wordmark';
import { STUDIO_FONT_VARS } from '@/lib/studio-fonts';
import { ADMIN_EYEBROW, ADMIN_FOCUS, ADMIN_ICON_BTN } from '@/components/admin/admin-ui';

type TabAccess = ReturnType<typeof RoleManager.getTabAccess>;
type Access = { tabs: TabAccess | null; dashboard: boolean };

interface NavItem {
  href: string;
  label: string;
  title: string;
  icon: LucideIcon;
  visible: (a: Access) => boolean;
  exact?: boolean;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

const ADMIN_ROOT = '/admin';

const NAV: NavSection[] = [
  {
    items: [
      { href: ADMIN_ROOT, label: 'Overview', title: 'Overview', icon: LayoutGrid, visible: () => true, exact: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/blogs', label: 'Blog posts', title: 'Blog posts', icon: Newspaper, visible: (a) => !!a.tabs?.blogs },
      { href: '/admin/authors', label: 'Authors', title: 'Authors', icon: UsersRound, visible: (a) => !!a.tabs?.authors },
      { href: '/admin/site-content', label: 'Site content', title: 'Site content', icon: ImageIcon, visible: (a) => !!a.tabs?.blogs },
    ],
  },
  {
    label: 'Clients',
    items: [
      { href: '/admin/leads', label: 'Leads', title: 'Leads', icon: UserCheck, visible: (a) => !!a.tabs?.leads },
      { href: '/admin/quotations', label: 'Quotations', title: 'Quotations', icon: FileText, visible: (a) => a.dashboard },
      { href: '/admin/billing', label: 'Billing', title: 'Billing & payments', icon: CreditCard, visible: (a) => a.dashboard },
      { href: '/admin/terms', label: 'Terms', title: 'Terms & conditions', icon: ScrollText, visible: (a) => a.dashboard },
      { href: '/admin/signatures', label: 'Signatures', title: 'Digital signatures', icon: FileSignature, visible: (a) => a.dashboard },
    ],
  },
  {
    label: 'Team',
    items: [
      { href: '/admin/employees', label: 'Employees', title: 'Employees', icon: Users, visible: (a) => !!a.tabs?.employees },
      { href: '/admin/activities', label: 'Activities', title: 'Activities', icon: Activity, visible: (a) => !!a.tabs?.activities },
      { href: '/admin/careers', label: 'Careers', title: 'Careers', icon: Briefcase, visible: (a) => !!a.tabs?.careers },
    ],
  },
  {
    label: 'Portfolio',
    items: [
      { href: '/admin/portfolio/websites', label: 'Websites', title: 'Website projects', icon: Globe, visible: (a) => !!a.tabs?.portfolioWebsites },
      { href: '/admin/portfolio/apps', label: 'Applications', title: 'App projects', icon: AppWindow, visible: (a) => !!a.tabs?.portfolioApps },
      { href: '/admin/portfolio/designs', label: 'Designs', title: 'Design projects', icon: Palette, visible: (a) => !!a.tabs?.portfolioDesigns },
      { href: '/admin/portfolio/creatives', label: 'Creatives', title: 'Creatives', icon: PenTool, visible: (a) => !!a.tabs?.portfolioCreatives },
      { href: '/admin/portfolio/ads-seo', label: 'Ads & SEO', title: 'Ads & SEO', icon: BarChart3, visible: (a) => !!a.tabs?.portfolioAdsSeo },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/messages', label: 'Messages', title: 'Contact messages', icon: Mail, visible: (a) => !!a.tabs?.messages },
      { href: '/admin/system', label: 'System health', title: 'System health', icon: HeartPulse, visible: (a) => !!a.tabs?.system },
    ],
  },
];

const ALL_ITEMS = NAV.flatMap((s) => s.items);

const isActive = (item: NavItem, pathname: string) =>
  item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

const currentItem = (pathname: string) =>
  ALL_ITEMS.filter((i) => isActive(i, pathname)).sort((a, b) => b.href.length - a.href.length)[0];

const TOAST_STYLE = {
  background: 'hsl(var(--card))',
  color: 'hsl(var(--foreground))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '16px',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname() ?? ADMIN_ROOT;
  const { user, roles, loading, canAccessAdminDashboard, signOut } = useAuth(true, true);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSidebarOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className={`studio ${STUDIO_FONT_VARS} flex min-h-screen flex-col items-center justify-center gap-6`}>
        <Wordmark className="text-[40px]" />
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  const access: Access = { tabs: roles ? RoleManager.getTabAccess(roles) : null, dashboard: canAccessAdminDashboard };
  const sections = NAV.map((s) => ({ ...s, items: s.items.filter((i) => i.visible(access)) })).filter((s) => s.items.length);
  const current = currentItem(pathname);
  const initial = user?.email?.charAt(0).toUpperCase() ?? '';

  return (
    <div className={`studio ${STUDIO_FONT_VARS} flex h-screen overflow-hidden`}>
      {sidebarOpen && (
        <button type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px] lg:hidden" />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-500 [transition-timing-function:cubic-bezier(.19,1,.22,1)] lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link href={ADMIN_ROOT} className={`flex items-center gap-3 rounded-sm ${ADMIN_FOCUS}`} aria-label="Formiq admin">
            <Wordmark className="text-[26px]" />
            <span className={`${ADMIN_EYEBROW} rounded-full border border-border px-2 py-0.5`}>Admin</span>
          </Link>
          <button type="button" onClick={() => setSidebarOpen(false)} className={`${ADMIN_ICON_BTN} lg:hidden`} aria-label="Close menu">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 pb-6 pt-2">
          {sections.map((section, si) => (
            <div key={section.label ?? si} className={si ? 'mt-6' : ''}>
              {section.label && <p className={`${ADMIN_EYEBROW} px-3 pb-2`}>{section.label}</p>}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = item === current;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={`group flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] transition-colors ${ADMIN_FOCUS} ${
                          active ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                        }`}
                      >
                        <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${active ? 'text-primary' : ''}`} strokeWidth={1.75} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">{initial}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{user?.email}</p>
              <p className={ADMIN_EYEBROW}>{roles ? RoleManager.getRoleDisplayName(roles) : ''}</p>
            </div>
            <button type="button" onClick={signOut} className={ADMIN_ICON_BTN} aria-label="Sign out" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between gap-4 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className={`${ADMIN_ICON_BTN} lg:hidden`}
              aria-label="Open menu"
              aria-controls="admin-sidebar"
              aria-expanded={sidebarOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className={`${ADMIN_EYEBROW} truncate`}>
              <Link href={ADMIN_ROOT} className="hover:text-foreground">Admin</Link>
              {current && current.href !== ADMIN_ROOT && <span className="text-foreground"> / {current.title}</span>}
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted ${ADMIN_FOCUS}`}
          >
            View site <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>

      <Toaster position="top-right" toastOptions={{ style: TOAST_STYLE }} />
    </div>
  );
}
