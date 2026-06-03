'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Database,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface HealthData {
  status: 'ok' | 'error' | 'degraded';
  timestamp: string;
  database: {
    connected: boolean;
    responseTime: string | null;
  };
  storage: {
    connected: boolean;
    responseTime: string | null;
  };
}

interface MetricsData {
  system: {
    uptime: number;
    memory: {
      rss: string;
      heapTotal: string;
      heapUsed: string;
    };
    requests: {
      total: number;
      errors: number;
      byPath: Record<string, number>;
    };
  };
  database: {
    users: number;
    blogPosts: number;
    websites: number;
    apps: number;
    designs: number;
    errors: string[];
  };
  storage: {
    buckets: number;
    error?: string;
  };
}

export default function SystemHealth() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<{success: boolean; message: string} | null>(null);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Health check failed: ${data.error || response.statusText}`);
      }

      setHealth(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch health data';
      setError(errorMessage);
      console.error('Health check error:', err);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      const response = await fetch('/api/metrics', {
        credentials: 'include',
        headers,
      });
      if (!response.ok) {
        return; // Silently fail - metrics are optional
      }
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Metrics fetch error:', err);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchHealth(), fetchMetrics()]);
    setLoading(false);
  };

  const triggerCleanup = async () => {
    setCleanupLoading(true);
    setCleanupResult(null);

    try {
      // Get the current session to include the auth token
      const { data: { session } } = await supabase.auth.getSession();

      // Prepare headers with authentication
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add the auth token if available
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Cleanup failed:', data);
        setCleanupResult({
          success: false,
          message: data.error || data.message || 'Cleanup failed with status: ' + response.status
        });
        return;
      }

      setCleanupResult({
        success: true,
        message: data.message || 'Cleanup completed successfully'
      });

      // Refresh metrics after cleanup
      await refreshData();
    } catch (err) {
      console.error('Cleanup error:', err);
      setCleanupResult({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error during cleanup'
      });
    } finally {
      setCleanupLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 mr-4">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">System Health</h1>
              <p className="mt-1 text-muted-foreground">Monitor system performance and resource usage</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-medium text-foreground transition-colors duration-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={triggerCleanup}
              disabled={cleanupLoading}
              className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-colors duration-200"
            >
              <Trash2 className={`w-4 h-4 mr-2 ${cleanupLoading ? 'animate-spin' : ''}`} />
              Run Cleanup
            </button>
          </div>
        </div>
      </div>

      {/* Cleanup Result */}
      {cleanupResult && (
        <div className={`p-4 rounded-xl ${cleanupResult.success ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-100 dark:border-red-900/30'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {cleanupResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{cleanupResult.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Status */}
        <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-medium text-foreground">System Status</h2>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
            </div>
          ) : health ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${health.status === 'ok'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : health.status === 'degraded'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                  {health.status === 'ok'
                    ? 'Healthy'
                    : health.status === 'degraded'
                      ? 'Degraded'
                      : 'Unhealthy'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Check</span>
                <span className="text-foreground">{formatDate(health.timestamp)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No health data available
            </div>
          )}
        </div>

        {/* Database Status */}
        <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-medium text-foreground">Database</h2>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Connection</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${health?.database.connected ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                  {health?.database.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Response Time</span>
                <span className="text-foreground">{health?.database.responseTime || 'N/A'}</span>
              </div>

              {metrics && (
                <div className="pt-2 border-t border-border mt-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Data Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Users</span>
                      <span className="text-xs text-foreground">{metrics.database.users}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Blog Posts</span>
                      <span className="text-xs text-foreground">{metrics.database.blogPosts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Websites</span>
                      <span className="text-xs text-foreground">{metrics.database.websites}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Apps</span>
                      <span className="text-xs text-foreground">{metrics.database.apps}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Designs</span>
                      <span className="text-xs text-foreground">{metrics.database.designs}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Storage Status */}
        <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
          <div className="flex items-center mb-4">
            <HardDrive className="w-5 h-5 text-accent mr-2" />
            <h2 className="text-lg font-medium text-foreground">Storage</h2>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Connection</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${health?.storage.connected ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                  {health?.storage.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Response Time</span>
                <span className="text-foreground">{health?.storage.responseTime || 'N/A'}</span>
              </div>

              {metrics && (
                <div className="pt-2 border-t border-border mt-2">
                  <h3 className="text-sm font-medium text-foreground mb-2">Storage Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Buckets</span>
                      <span className="text-xs text-foreground">{metrics.storage.buckets}</span>
                    </div>
                    {metrics.storage.error && (
                      <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                        Error: {metrics.storage.error}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-border mt-2">
                <h3 className="text-sm font-medium text-foreground mb-2">Cleanup</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Run cleanup to remove unused files and optimize storage usage.
                </p>
                <button
                  onClick={triggerCleanup}
                  disabled={cleanupLoading}
                  className="w-full inline-flex justify-center items-center px-3 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-xs transition-colors duration-200"
                >
                  {cleanupLoading ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                      Running Cleanup...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3 h-3 mr-2" />
                      Run Storage Cleanup
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Metrics */}
      {metrics && (
        <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
          <h2 className="text-lg font-medium text-foreground mb-4">Request Metrics</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-secondary/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-foreground mb-1">Total Requests</h3>
              <p className="text-2xl font-bold text-foreground">{metrics.system.requests.total}</p>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-foreground mb-1">Error Rate</h3>
              <p className="text-2xl font-bold text-foreground">
                {metrics.system.requests.total > 0
                  ? `${((metrics.system.requests.errors / metrics.system.requests.total) * 100).toFixed(2)}%`
                  : '0%'}
              </p>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-foreground mb-1">Errors</h3>
              <p className="text-2xl font-bold text-foreground">{metrics.system.requests.errors}</p>
            </div>
          </div>

          <h3 className="text-sm font-medium text-foreground mb-2">Top Paths</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Path</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Requests</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {Object.entries(metrics.system.requests.byPath)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([path, count]) => (
                    <tr key={path} className="hover:bg-secondary/30">
                      <td className="px-4 py-2 text-sm text-foreground">{path}</td>
                      <td className="px-4 py-2 text-sm text-right text-foreground">{count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}
