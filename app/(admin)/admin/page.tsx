'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Plus,
  Activity,
  Clock,
  User,
  Loader2,
  ArrowRight,
  PenLine,
  Users,
  Globe,
  AppWindow,
  UserPlus,
  Briefcase,
  UserCircle,
  Pencil,
  FilePlus,
  RefreshCw,
  LogIn,
  LogOut,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_EMPTY,
  ADMIN_EYEBROW,
  ADMIN_FOCUS,
  ADMIN_H2,
  ADMIN_ROW,
  ADMIN_STAT_VALUE,
  ADMIN_TABLE,
  ADMIN_TD,
  ADMIN_TH,
} from '@/components/admin/admin-ui';

const STAT_TILES: Array<{ key: string; label: string; href: string; linkLabel: string; icon: LucideIcon }> = [
  { key: 'totalPosts', label: 'Blog posts', href: '/admin/blogs', linkLabel: 'View all posts', icon: PenLine },
  { key: 'totalAuthors', label: 'Authors', href: '/admin/authors', linkLabel: 'Manage authors', icon: Users },
  { key: 'totalWebsites', label: 'Websites', href: '/admin/portfolio/websites', linkLabel: 'Manage websites', icon: Globe },
  { key: 'totalApps', label: 'Applications', href: '/admin/portfolio/apps', linkLabel: 'Manage applications', icon: AppWindow },
  { key: 'totalLeads', label: 'Leads', href: '/admin/leads', linkLabel: 'Manage leads', icon: UserPlus },
  { key: 'totalEmployees', label: 'Employees', href: '/admin/employees', linkLabel: 'Manage employees', icon: Briefcase },
];

const ACTIVITY_ICON: Record<string, LucideIcon> = {
  account_created: UserCircle,
  profile_updated: Pencil,
  lead_created: FilePlus,
  lead_updated: RefreshCw,
  login: LogIn,
  logout: LogOut,
};
const DEFAULT_ACTIVITY_ICON = ClipboardList;

const LINK_TEXT = `rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${ADMIN_FOCUS}`;

export default function AdminDashboard() {
  const [stats, setStats]:any = useState({
    totalPosts: 0,
    totalAuthors: 0,
    totalWebsites: 0,
    totalApps: 0,
    totalLeads: 0,
    totalEmployees: 0,
    recentPosts: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  const getActivityIcon = (type: string) => {
    const Icon = ACTIVITY_ICON[type] || DEFAULT_ACTIVITY_ICON;
    return <Icon className="h-4 w-4 text-muted-foreground" />;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: postsCount, error: postsError } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });

        const { count: authorsCount, error: authorsError } = await supabase
          .from('blog_authors')
          .select('*', { count: 'exact', head: true });

        const { count: websitesCount, error: websitesError } = await supabase
          .from('portfolio_websites')
          .select('*', { count: 'exact', head: true });

        const { count: appsCount, error: appsError } = await supabase
          .from('portfolio_apps')
          .select('*', { count: 'exact', head: true });

        const { count: leadsCount, error: leadsError } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true });

        const { count: employeesCount, error: employeesError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const { data: recentPosts, error: recentPostsError } = await supabase
          .from('blog_posts')
          .select('id, title, created_at, slug')
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: recentActivities, error: activitiesError } = await supabase
          .from('user_activities')
          .select(`
            *,
            user:user_id(id, full_name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (postsError || authorsError || websitesError || appsError || recentPostsError || leadsError || employeesError || activitiesError) {
          console.error('Error fetching stats:', postsError || authorsError || websitesError || appsError || recentPostsError || leadsError || employeesError || activitiesError);
          return;
        }

        setStats({
          totalPosts: postsCount || 0,
          totalAuthors: authorsCount || 0,
          totalWebsites: websitesCount || 0,
          totalApps: appsCount || 0,
          totalLeads: leadsCount || 0,
          totalEmployees: employeesCount || 0,
          recentPosts: recentPosts || [],
          recentActivities: recentActivities || []
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="Welcome back"
        description="Manage your content, portfolio and pipeline from one place."
        actions={
          <Link href="/admin/blogs/new" className={ADMIN_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            New blog post
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {STAT_TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <div key={tile.key} className={`${ADMIN_CARD} flex flex-col`}>
              <div className={`${ADMIN_CARD_PAD} flex-1`}>
                <div className="flex items-center justify-between gap-3">
                  <p className={ADMIN_EYEBROW}>{tile.label}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className={`mt-4 ${ADMIN_STAT_VALUE}`}>{stats[tile.key]}</p>
              </div>
              <div className="border-t border-border px-5 py-3 sm:px-6">
                <Link
                  href={tile.href}
                  className={`flex items-center justify-between ${LINK_TEXT}`}
                >
                  <span>{tile.linkLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${ADMIN_CARD} overflow-hidden lg:col-span-2`}>
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <h2 className={ADMIN_H2}>Recent posts</h2>
            <Link href="/admin/blogs" className={LINK_TEXT}>
              View all
            </Link>
          </div>

          {stats.recentPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className={ADMIN_TABLE}>
                <thead>
                  <tr>
                    <th scope="col" className={ADMIN_TH}>Title</th>
                    <th scope="col" className={ADMIN_TH}>Date</th>
                    <th scope="col" className={`${ADMIN_TH} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentPosts.map((post: any) => (
                    <tr key={post.id} className={ADMIN_ROW}>
                      <td className={`${ADMIN_TD} font-medium`}>
                        <div className="max-w-[28rem] truncate">{post.title}</div>
                      </td>
                      <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground`}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className={`${ADMIN_TD} whitespace-nowrap text-right`}>
                        <div className="flex items-center justify-end gap-4">
                          <Link href={`/admin/blogs/${post.id}/edit`} className={LINK_TEXT}>
                            Edit
                          </Link>
                          <Link href={`/blog/${post.slug}`} className={LINK_TEXT} target="_blank">
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={ADMIN_EMPTY}>
              <PenLine className="mx-auto mb-4 h-5 w-5 text-muted-foreground" />
              <p className="font-medium text-foreground">No posts yet</p>
              <p className="mt-1">Get started by creating your first blog post.</p>
              <Link href="/admin/blogs/new" className={`mt-6 ${ADMIN_BTN_PRIMARY}`}>
                <Plus className="h-4 w-4" />
                Create post
              </Link>
            </div>
          )}
        </div>

        <div className={`${ADMIN_CARD} overflow-hidden`}>
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <h2 className={ADMIN_H2}>Recent activity</h2>
            <Link href="/admin/activities" className={LINK_TEXT}>
              View all
            </Link>
          </div>

          {stats.recentActivities.length > 0 ? (
            <ul className="divide-y divide-border">
              {stats.recentActivities.map((activity: any) => (
                <li key={activity.id} className="px-5 py-4 transition-colors hover:bg-muted/40 sm:px-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground break-words">
                        {activity.description}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex min-w-0 items-center gap-1">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{activity.user?.full_name || activity.user?.email || 'Unknown'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(activity.created_at)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={ADMIN_EMPTY}>
              <Activity className="mx-auto mb-4 h-5 w-5 text-muted-foreground" />
              <p className="font-medium text-foreground">No activity yet</p>
              <p className="mt-1">User activity will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
