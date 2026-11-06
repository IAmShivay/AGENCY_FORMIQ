'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Search, AppWindow, Smartphone , Loader2 } from 'lucide-react';
import { AppProject } from '@/lib/portfolio';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BADGE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_H2,
  ADMIN_ICON_BTN,
  ADMIN_INPUT,
  ADMIN_ROW,
  ADMIN_TABLE,
  ADMIN_TABLE_WRAP,
  ADMIN_TD,
  ADMIN_TH,
  ADMIN_TONE,
} from '@/components/admin/admin-ui';

export default function AppsPage() {
  const [apps, setApps] = useState<AppProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [isDeleting, setIsDeleting] = useState(false);

  const platforms = ['All', 'Web', 'iOS', 'Android', 'macOS', 'Windows', 'iPad'];

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_apps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApps(data || []);
    } catch (error) {
      console.error('Error fetching apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteApp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this app? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('portfolio_apps')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchApps();
    } catch (error) {
      console.error('Error deleting app:', error);
      alert('Failed to delete app. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.tags && app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesPlatform =
      selectedPlatform === 'All' ||
      (app.platforms && app.platforms.includes(selectedPlatform));

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio"
        title="App portfolio"
        description="Manage the application projects shown in the portfolio."
        actions={
          <Link href="/admin/apps/new" className={ADMIN_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            New app
          </Link>
        }
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${ADMIN_INPUT} pl-10`}
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className={ADMIN_INPUT}
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredApps.length > 0 ? (
        <div className={ADMIN_TABLE_WRAP}>
          <table className={ADMIN_TABLE}>
            <thead>
              <tr>
                <th scope="col" className={ADMIN_TH}>App</th>
                <th scope="col" className={ADMIN_TH}>Platforms</th>
                <th scope="col" className={ADMIN_TH}>Year</th>
                <th scope="col" className={`${ADMIN_TH} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} className={ADMIN_ROW}>
                  <td className={`${ADMIN_TD} whitespace-nowrap`}>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 shrink-0">
                        {app.image ? (
                          <img
                            className="h-10 w-10 rounded-xl border border-border object-cover"
                            src={app.image}
                            alt={app.title}
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                            <AppWindow className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground">{app.title}</div>
                        <div className="line-clamp-1 max-w-xs whitespace-normal text-muted-foreground">
                          {app.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap`}>
                    <div className="flex flex-wrap gap-1">
                      {app.platforms && app.platforms.map((platform) => (
                        <span key={platform} className={`${ADMIN_BADGE} ${ADMIN_TONE.neutral}`}>
                          {platform}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground tabular-nums`}>
                    {app.year || 'N/A'}
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap text-right`}>
                    <div className="inline-flex items-center gap-1">
                      <Link href={`/admin/apps/${app.id}/edit`} className={ADMIN_ICON_BTN} aria-label="Edit app">
                        <Edit className="h-4 w-4" />
                      </Link>
                      {app.link && (
                        <a
                          href={app.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={ADMIN_ICON_BTN}
                          aria-label="Open app link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => deleteApp(app.id)}
                        disabled={isDeleting}
                        className={`${ADMIN_ICON_BTN} hover:bg-destructive/10 hover:text-destructive disabled:opacity-50`}
                        aria-label="Delete app"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} py-14 text-center`}>
          <Smartphone className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className={`${ADMIN_H2} mb-2`}>No apps found</h3>
          <p className="mb-5 text-sm text-muted-foreground">
            {searchTerm || selectedPlatform !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first app project.'}
          </p>
          <Link href="/admin/apps/new" className={ADMIN_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            Add app
          </Link>
        </div>
      )}
    </div>
  );
}
