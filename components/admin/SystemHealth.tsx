'use client';

import { useState, useEffect, type ReactNode } from 'react';
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
import {
  ADMIN_BADGE,
  ADMIN_BTN_DANGER,
  ADMIN_BTN_OUTLINE,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_EYEBROW,
  ADMIN_H2,
  ADMIN_ROW,
  ADMIN_STAT_VALUE,
  ADMIN_TABLE,
  ADMIN_TD,
  ADMIN_TH,
  ADMIN_TONE,
  type AdminTone,
} from '@/components/admin/admin-ui';

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

const HEALTH_STATUS: Record<HealthData['status'], { label: string; tone: AdminTone }> = {
  ok: { label: 'Healthy', tone: 'positive' },
  degraded: { label: 'Degraded', tone: 'warning' },
  error: { label: 'Unhealthy', tone: 'negative' },
};

const CONNECTION_STATUS: Record<'connected' | 'disconnected', { label: string; tone: AdminTone }> = {
  connected: { label: 'Connected', tone: 'positive' },
  disconnected: { label: 'Disconnected', tone: 'negative' },
};

const SKELETON = (
  <div className="animate-pulse space-y-3">
    <div className="h-4 w-3/4 rounded-full bg-muted"></div>
    <div className="h-4 w-1/2 rounded-full bg-muted"></div>
    <div className="h-4 w-5/6 rounded-full bg-muted"></div>
  </div>
);

function StatusBadge({ label, tone }: { label: string; tone: AdminTone }) {
  return <span className={`${ADMIN_BADGE} ${ADMIN_TONE[tone]}`}>{label}</span>;
}

function connection(connected: boolean | undefined) {
  return connected ? CONNECTION_STATUS.connected : CONNECTION_STATUS.disconnected;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right text-sm text-foreground">{children}</span>
    </div>
  );
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
        return;
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
      const { data: { session } } = await supabase.auth.getSession();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
        credentials: 'include',
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

    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={refreshData}
          disabled={loading}
          className={ADMIN_BTN_OUTLINE}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        <button
          type="button"
          onClick={triggerCleanup}
          disabled={cleanupLoading}
          className={ADMIN_BTN_DANGER}
        >
          <Trash2 className={`h-4 w-4 ${cleanupLoading ? 'animate-spin' : ''}`} />
          Run cleanup
        </button>
      </div>

      {cleanupResult && (
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${cleanupResult.success ? ADMIN_TONE.positive : ADMIN_TONE.negative}`}>
          {cleanupResult.success ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          <p className="text-sm font-medium">{cleanupResult.message}</p>
        </div>
      )}

      {error && (
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${ADMIN_TONE.negative}`}>
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <section className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
          <div className="mb-5 flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h2 className={ADMIN_H2}>System status</h2>
          </div>

          {loading ? SKELETON : health ? (
            <div className="space-y-3">
              <Row label="Status">
                <StatusBadge {...(HEALTH_STATUS[health.status] || HEALTH_STATUS.error)} />
              </Row>
              <Row label="Last check">{formatDate(health.timestamp)}</Row>
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No health data available
            </p>
          )}
        </section>

        <section className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
          <div className="mb-5 flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <h2 className={ADMIN_H2}>Database</h2>
          </div>

          {loading ? SKELETON : (
            <div className="space-y-3">
              <Row label="Connection">
                <StatusBadge {...connection(health?.database.connected)} />
              </Row>
              <Row label="Response time">{health?.database.responseTime || 'N/A'}</Row>

              {metrics && (
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  <p className={`${ADMIN_EYEBROW} mb-3`}>Data summary</p>
                  <Row label="Users">{metrics.database.users}</Row>
                  <Row label="Blog posts">{metrics.database.blogPosts}</Row>
                  <Row label="Websites">{metrics.database.websites}</Row>
                  <Row label="Apps">{metrics.database.apps}</Row>
                  <Row label="Designs">{metrics.database.designs}</Row>
                </div>
              )}
            </div>
          )}
        </section>

        <section className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
          <div className="mb-5 flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <h2 className={ADMIN_H2}>Storage</h2>
          </div>

          {loading ? SKELETON : (
            <div className="space-y-3">
              <Row label="Connection">
                <StatusBadge {...connection(health?.storage.connected)} />
              </Row>
              <Row label="Response time">{health?.storage.responseTime || 'N/A'}</Row>

              {metrics && (
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  <p className={`${ADMIN_EYEBROW} mb-3`}>Storage summary</p>
                  <Row label="Buckets">{metrics.storage.buckets}</Row>
                  {metrics.storage.error && (
                    <p className="mt-1 text-xs text-destructive">
                      Error: {metrics.storage.error}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 border-t border-border pt-4">
                <p className={`${ADMIN_EYEBROW} mb-2`}>Cleanup</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Run cleanup to remove unused files and optimise storage usage.
                </p>
                <button
                  type="button"
                  onClick={triggerCleanup}
                  disabled={cleanupLoading}
                  className={`${ADMIN_BTN_OUTLINE} w-full`}
                >
                  {cleanupLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Running cleanup...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Run storage cleanup
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {metrics && (
        <section className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
          <h2 className={`${ADMIN_H2} mb-5`}>Request metrics</h2>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border p-4">
              <p className={ADMIN_EYEBROW}>Total requests</p>
              <p className={`${ADMIN_STAT_VALUE} mt-3`}>{metrics.system.requests.total}</p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <p className={ADMIN_EYEBROW}>Error rate</p>
              <p className={`${ADMIN_STAT_VALUE} mt-3`}>
                {metrics.system.requests.total > 0
                  ? `${((metrics.system.requests.errors / metrics.system.requests.total) * 100).toFixed(2)}%`
                  : '0%'}
              </p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <p className={ADMIN_EYEBROW}>Errors</p>
              <p className={`${ADMIN_STAT_VALUE} mt-3`}>{metrics.system.requests.errors}</p>
            </div>
          </div>

          <p className={`${ADMIN_EYEBROW} mb-3`}>Top paths</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className={ADMIN_TABLE}>
              <thead>
                <tr>
                  <th scope="col" className={ADMIN_TH}>Path</th>
                  <th scope="col" className={`${ADMIN_TH} text-right`}>Requests</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(metrics.system.requests.byPath)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([path, count]) => (
                    <tr key={path} className={ADMIN_ROW}>
                      <td className={`${ADMIN_TD} break-all font-mono text-xs`}>{path}</td>
                      <td className={`${ADMIN_TD} text-right tabular-nums`}>{count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

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
