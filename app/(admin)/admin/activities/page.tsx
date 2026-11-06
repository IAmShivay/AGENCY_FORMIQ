'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  Filter,
  Calendar,
  User,
  RefreshCw,
  Loader2,
  UserCircle,
  Pencil,
  FilePlus,
  LogIn,
  LogOut,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BADGE,
  ADMIN_BTN_OUTLINE,
  ADMIN_CARD,
  ADMIN_EMPTY,
  ADMIN_H2,
  ADMIN_INPUT,
  ADMIN_TONE,
  type AdminTone,
} from '@/components/admin/admin-ui';

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  metadata: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
}

const ACTIVITY_ICON: Record<string, LucideIcon> = {
  account_created: UserCircle,
  profile_updated: Pencil,
  lead_created: FilePlus,
  lead_updated: RefreshCw,
  login: LogIn,
  logout: LogOut,
};
const DEFAULT_ACTIVITY_ICON = ClipboardList;

const ACTIVITY_TONE: Record<string, AdminTone> = {
  account_created: 'accent',
  profile_updated: 'neutral',
  lead_created: 'accent',
  lead_updated: 'warning',
  login: 'positive',
  logout: 'neutral',
};
const DEFAULT_ACTIVITY_TONE: AdminTone = 'neutral';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7');

  const fetchActivities = async () => {
    try {
      let query = supabase
        .from('user_activities')
        .select(`
          *,
          user:user_id(id, full_name, email, role)
        `)
        .order('created_at', { ascending: false });

      if (dateRange !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
        query = query.gte('created_at', daysAgo.toISOString());
      }

      if (activityTypeFilter !== 'all') {
        query = query.eq('activity_type', activityTypeFilter);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [activityTypeFilter, dateRange]);

  const filteredActivities = activities.filter(activity =>
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityIcon = (type: string) => {
    const Icon = ACTIVITY_ICON[type] || DEFAULT_ACTIVITY_ICON;
    return <Icon className="h-4 w-4 text-muted-foreground" />;
  };

  const getActivityBadge = (type: string) =>
    `${ADMIN_BADGE} ${ADMIN_TONE[ACTIVITY_TONE[type] || DEFAULT_ACTIVITY_TONE]}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  };

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
        eyebrow="Team"
        title="Activity"
        description="Monitor user activity and system events across your organization."
        actions={
          <button onClick={fetchActivities} className={ADMIN_BTN_OUTLINE}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${ADMIN_INPUT} pl-10`}
          />
        </div>

        <div className="relative">
          <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={activityTypeFilter}
            onChange={(e) => setActivityTypeFilter(e.target.value)}
            className={`${ADMIN_INPUT} pl-10 pr-8`}
          >
            <option value="all">All activities</option>
            <option value="account_created">Account created</option>
            <option value="profile_updated">Profile updated</option>
            <option value="lead_created">Lead created</option>
            <option value="lead_updated">Lead updated</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
        </div>

        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`${ADMIN_INPUT} pl-10 pr-8`}
          >
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className={`${ADMIN_CARD} overflow-hidden`}>
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <h2 className={ADMIN_H2}>Recent activity</h2>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">{filteredActivities.length}</span>
        </div>

        {filteredActivities.length === 0 ? (
          <div className={ADMIN_EMPTY}>
            <Activity className="mx-auto mb-4 h-5 w-5 text-muted-foreground" />
            <p>No activities found matching your criteria.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredActivities.map((activity) => (
              <li key={activity.id} className="px-5 py-4 transition-colors hover:bg-muted/40 sm:px-6 sm:py-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border">
                    {getActivityIcon(activity.activity_type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className={getActivityBadge(activity.activity_type)}>
                        {activity.activity_type.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>

                    <p className="mb-1.5 break-words font-medium text-foreground">
                      {activity.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{activity.user?.full_name || activity.user?.email || 'Unknown user'}</span>
                      </div>
                      {activity.user?.role && (
                        <span className={`${ADMIN_BADGE} ${ADMIN_TONE.neutral}`}>
                          {activity.user.role}
                        </span>
                      )}
                    </div>

                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-3 overflow-x-auto rounded-xl bg-muted/50 p-3">
                        <pre className="whitespace-pre-wrap break-all font-mono text-xs text-muted-foreground">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
