'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Activity, Clock, User , Loader2 } from 'lucide-react';
import Link from 'next/link';

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
    switch (type) {
      case 'account_created': return '👤';
      case 'profile_updated': return '✏️';
      case 'lead_created': return '📝';
      case 'lead_updated': return '🔄';
      case 'login': return '🔐';
      case 'logout': return '🚪';
      default: return '📋';
    }
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
        // Get total posts count
        const { count: postsCount, error: postsError } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });

        // Get total authors count
        const { count: authorsCount, error: authorsError } = await supabase
          .from('blog_authors')
          .select('*', { count: 'exact', head: true });

        // Get total websites count
        const { count: websitesCount, error: websitesError } = await supabase
          .from('portfolio_websites')
          .select('*', { count: 'exact', head: true });

        // Get total apps count
        const { count: appsCount, error: appsError } = await supabase
          .from('portfolio_apps')
          .select('*', { count: 'exact', head: true });

        // Get total leads count
        const { count: leadsCount, error: leadsError } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true });

        // Get total employees count
        const { count: employeesCount, error: employeesError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Get recent posts
        const { data: recentPosts, error: recentPostsError } = await supabase
          .from('blog_posts')
          .select('id, title, created_at, slug')
          .order('created_at', { ascending: false })
          .limit(5);

        // Get recent activities
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
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Modern AI-Era Styling */}
      <div className="relative bg-gradient-to-r from-primary to-accent rounded-2xl shadow-lg p-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
            </div>
            <p className="text-white/80 ml-[52px]">Manage your content and portfolio from this AI-powered dashboard</p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl shadow-md hover:bg-white/20 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Blog Post
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards with Modern AI-Era Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {/* Blog Posts */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] border border-border">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-muted-foreground">Blog Posts</h2>
                <p className="text-2xl font-bold text-foreground">{stats.totalPosts}</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/50 px-6 py-3 border-t border-border">
            <Link
              href="/admin/blogs"
              className="flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <span>View all posts</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Authors */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] border border-border">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-muted-foreground">Authors</h2>
                <p className="text-2xl font-bold text-foreground">{stats.totalAuthors}</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/50 px-6 py-3 border-t border-border">
            <Link
              href="/admin/authors"
              className="flex items-center justify-between text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              <span>Manage authors</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Websites */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] border border-border">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-cyan-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-muted-foreground">Websites</h2>
                <p className="text-2xl font-bold text-foreground">{stats.totalWebsites}</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/50 px-6 py-3 border-t border-border">
            <Link
              href="/admin/portfolio/websites"
              className="flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <span>Manage websites</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Applications */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] border border-border">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-cyan-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-muted-foreground">Applications</h2>
                <p className="text-2xl font-bold text-foreground">{stats.totalApps}</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/50 px-6 py-3 border-t border-border">
            <Link
              href="/admin/portfolio/apps"
              className="flex items-center justify-between text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              <span>Manage applications</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Leads */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] border border-border">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-muted-foreground">Leads</h2>
                <p className="text-2xl font-bold text-foreground">{stats.totalLeads}</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/50 px-6 py-3 border-t border-border">
            <Link
              href="/admin/leads"
              className="flex items-center justify-between text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <span>Manage leads</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Employees */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] border border-border">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-muted-foreground">Employees</h2>
                <p className="text-2xl font-bold text-foreground">{stats.totalEmployees}</p>
              </div>
            </div>
          </div>
          <div className="bg-secondary/50 px-6 py-3 border-t border-border">
            <Link
              href="/admin/employees"
              className="flex items-center justify-between text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              <span>Manage employees</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section with Modern AI-Era Styling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-md overflow-hidden border border-border">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <h2 className="text-lg font-semibold text-foreground">Recent Posts</h2>
            </div>
            <Link
              href="/admin/blogs"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all
            </Link>
          </div>

          {stats.recentPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.recentPosts.map((post: any) => (
                    <tr key={post.id} className="hover:bg-secondary/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">{post.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/blogs/${post.id}/edit`}
                          className="text-primary hover:text-primary/80 mr-4 transition-colors"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          target="_blank"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">Get started by creating your first blog post</p>
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium rounded-lg transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Post
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activities with Modern AI-Era Styling */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden border border-border">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg mr-2">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Recent Activities</h2>
            </div>
            <Link
              href="/admin/activities"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all
            </Link>
            </div>
          </div>

          {stats.recentActivities.length > 0 ? (
            <div className="divide-y divide-border">
              {stats.recentActivities.map((activity: any) => (
                <div key={activity.id} className="p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-sm">
                        {getActivityIcon(activity.activity_type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{activity.user?.full_name || activity.user?.email || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(activity.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">No activities yet</h3>
              <p className="text-xs text-muted-foreground">User activities will appear here</p>
            </div>
          )}
        </div>
      </div>
    
  );
}
