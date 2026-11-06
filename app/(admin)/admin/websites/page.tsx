'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Search, Globe , Loader2 } from 'lucide-react';
import { WebsiteProject } from '@/lib/portfolio';
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

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<WebsiteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = ['All', 'E-Commerce', 'Corporate', 'Educational', 'Landing Pages', 'Portfolio', 'Blog', 'Other'];

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebsites(data || []);
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWebsite = async (id: string) => {
    if (!confirm('Are you sure you want to delete this website? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('portfolio_websites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchWebsites();
    } catch (error) {
      console.error('Error deleting website:', error);
      alert('Failed to delete website. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredWebsites = websites.filter(website => {
    const matchesSearch =
      website.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      website.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (website.tags && website.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory =
      selectedCategory === 'All' ||
      website.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio"
        title="Website portfolio"
        description="Manage the website projects shown in the portfolio."
        actions={
          <Link href="/admin/websites/new" className={ADMIN_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            New website
          </Link>
        }
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search websites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${ADMIN_INPUT} pl-10`}
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={ADMIN_INPUT}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredWebsites.length > 0 ? (
        <div className={ADMIN_TABLE_WRAP}>
          <table className={ADMIN_TABLE}>
            <thead>
              <tr>
                <th scope="col" className={ADMIN_TH}>Website</th>
                <th scope="col" className={ADMIN_TH}>Category</th>
                <th scope="col" className={ADMIN_TH}>Completion date</th>
                <th scope="col" className={`${ADMIN_TH} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWebsites.map((website) => (
                <tr key={website.id} className={ADMIN_ROW}>
                  <td className={`${ADMIN_TD} whitespace-nowrap`}>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 shrink-0">
                        {website.image ? (
                          <img
                            className="h-10 w-10 rounded-xl border border-border object-cover"
                            src={website.image}
                            alt={website.title}
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                            <Globe className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground">{website.title}</div>
                        <div className="line-clamp-1 max-w-xs whitespace-normal text-muted-foreground">
                          {website.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap`}>
                    <span className={`${ADMIN_BADGE} ${ADMIN_TONE.accent}`}>{website.category}</span>
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground tabular-nums`}>
                    {website.completion_date || 'N/A'}
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap text-right`}>
                    <div className="inline-flex items-center gap-1">
                      <Link href={`/admin/websites/${website.id}/edit`} className={ADMIN_ICON_BTN} aria-label="Edit website">
                        <Edit className="h-4 w-4" />
                      </Link>
                      {website.live_link && (
                        <a
                          href={website.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={ADMIN_ICON_BTN}
                          aria-label="Open live site"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => deleteWebsite(website.id)}
                        disabled={isDeleting}
                        className={`${ADMIN_ICON_BTN} hover:bg-destructive/10 hover:text-destructive disabled:opacity-50`}
                        aria-label="Delete website"
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
          <Globe className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className={`${ADMIN_H2} mb-2`}>No websites found</h3>
          <p className="mb-5 text-sm text-muted-foreground">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first website project.'}
          </p>
          <Link href="/admin/websites/new" className={ADMIN_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            Add website
          </Link>
        </div>
      )}
    </div>
  );
}
