'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar,
  User,
  Clock,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

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

      // Apply date filter
      if (dateRange !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
        query = query.gte('created_at', daysAgo.toISOString());
      }

      // Apply activity type filter
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

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'account_created': return 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary';
      case 'profile_updated': return 'bg-gradient-to-r from-primary/10 to-indigo-100 text-primary';
      case 'lead_created': return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900/20 dark:to-pink-900/20 dark:text-purple-200';
      case 'lead_updated': return 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/20 dark:to-orange-900/20 dark:text-amber-200';
      case 'login': return 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 dark:from-emerald-900/20 dark:to-teal-900/20 dark:text-emerald-200';
      case 'logout': return 'bg-gradient-to-r from-secondary to-slate-100 text-foreground';
      default: return 'bg-gradient-to-r from-secondary to-slate-100 text-foreground';
    }
  };

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Activity Management</h1>
            <p className="text-muted-foreground mt-1">
              Monitor user activities and system events across your organization
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground"
            />
          </div>

          {/* Activity Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <select
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground appearance-none"
            >
              <option value="all">All Activities</option>
              <option value="account_created">Account Created</option>
              <option value="profile_updated">Profile Updated</option>
              <option value="lead_created">Lead Created</option>
              <option value="lead_updated">Lead Updated</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground appearance-none"
            >
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchActivities}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200 shadow-lg"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-card rounded-xl shadow-sm border border-border">
        <div className="p-4 md:p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Activities ({filteredActivities.length})
          </h2>
        </div>

        <div className="divide-y divide-border">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activities found matching your criteria</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="p-4 md:p-6 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Activity Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.activity_type)}`}>
                        {activity.activity_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>

                    <p className="text-foreground font-medium mb-1">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{activity.user?.full_name || activity.user?.email || 'Unknown User'}</span>
                      </div>
                      {activity.user?.role && (
                        <span className="px-2 py-1 bg-secondary rounded text-xs">
                          {activity.user.role}
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-2 p-2 bg-secondary/50 rounded text-xs">
                        <pre className="text-muted-foreground whitespace-pre-wrap">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
