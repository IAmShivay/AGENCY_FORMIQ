"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Smartphone, PaintBucket, ArrowRight, ArrowUpRight, Loader2 } from 'lucide-react';
import PageHeader from './studio/PageHeader';
import { CONTAINER, EYEBROW, FOCUS_RING, H2, SECTION_Y, pad2 } from './studio/ui';
import {
  getWebsiteProjects,
  getAppProjects,
  getDesignProjects,
  WebsiteProject,
  AppProject,
  DesignProject
} from '@/lib/portfolio';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'website' | 'app' | 'design';
  link: string;
}

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'websites', label: 'Websites' },
  { id: 'apps', label: 'Apps' },
  { id: 'designs', label: 'Designs' },
] as const;

const TYPE_LABEL: Record<PortfolioItem['type'], string> = { website: 'Website', app: 'App', design: 'Design' };

const CATEGORIES = [
  { href: '/portfolio/websites', label: 'Websites' },
  { href: '/portfolio/applications', label: 'Applications' },
  { href: '/portfolio/design', label: 'Design work' },
  { href: '/portfolio/creatives', label: 'Creatives' },
  { href: '/portfolio/ads-seo', label: 'Ads & SEO' },
];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const [websites, apps, designs] = await Promise.all([
        getWebsiteProjects(),
        getAppProjects(),
        getDesignProjects()
      ]);

      const all: PortfolioItem[] = [
        ...websites.map((w: WebsiteProject) => ({
          id: w.id, title: w.title, description: w.description,
          image: w.image && w.image !== '#' ? w.image : '',
          type: 'website' as const, link: w.live_link || w.link || '#',
        })),
        ...apps.map((a: AppProject) => ({
          id: a.id, title: a.title, description: a.description,
          image: a.image && a.image !== '#' ? a.image : '',
          type: 'app' as const, link: a.live_link || a.link || '#',
        })),
        ...designs.map((d: DesignProject) => ({
          id: d.id, title: d.title, description: d.description,
          image: d.image && d.image !== '#' ? d.image : '',
          type: 'design' as const, link: d.live_link || d.link || '#',
        })),
      ];

      const unique = all.filter((item, i, self) => i === self.findIndex(t => t.id === item.id));
      setItems(unique);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return items;
    const typeMap: Record<string, string> = { websites: 'website', apps: 'app', designs: 'design' };
    return items.filter(i => i.type === typeMap[activeTab]);
  }, [activeTab, items]);

  const typeIcon = (type: string) => {
    if (type === 'website') return <Globe className="w-6 h-6" aria-hidden="true" />;
    if (type === 'app') return <Smartphone className="w-6 h-6" aria-hidden="true" />;
    return <PaintBucket className="w-6 h-6" aria-hidden="true" />;
  };

  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="(01) Portfolio"
        title={<>Selected <span className="text-primary">work</span></>}
        intro="Projects that showcase our commitment to quality and innovation."
      />

      <section className="pb-20 sm:pb-28 lg:pb-32">
        <div className={CONTAINER}>
          {/* Filters */}
          <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2 mb-10 sm:mb-14">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-11 px-5 rounded-full text-sm font-medium border transition-colors duration-300 ${FOCUS_RING} ${
                    active
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loading && (
            <div className="flex justify-center py-16" role="status">
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" aria-hidden="true" />
              <span className="sr-only">Loading projects</span>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => {
                const hasLink = item.link && item.link !== '#';
                return (
                  <li key={item.id} className="group relative">
                    <div className="relative overflow-hidden rounded-[22px] border border-border bg-muted aspect-[4/3]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          {typeIcon(item.type)}
                        </div>
                      )}
                    </div>
                    <p className={`${EYEBROW} mt-5`}>{TYPE_LABEL[item.type]}</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.035em] leading-tight line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-muted-foreground line-clamp-2">{item.description}</p>
                    {hasLink && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold rounded-sm ${FOCUS_RING}`}
                      >
                        <span className="link-draw">View live</span>
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                        <span className="sr-only">: {item.title} (opens in a new tab)</span>
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-muted-foreground py-12">No projects found.</p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className={`tone-sand ${SECTION_Y}`}>
        <div className={CONTAINER}>
          <p className={`${EYEBROW} mb-5`}>(02) Browse by category</p>
          <h2 className={`${H2} mb-12 sm:mb-16`}>More of our work</h2>
          <ul className="border-t border-border">
            {CATEGORIES.map((c, i) => (
              <li key={c.href} className="border-b border-border">
                <Link
                  href={c.href}
                  className={`group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] sm:grid-cols-[4rem_minmax(0,1fr)_auto] items-center gap-x-3 sm:gap-x-6 py-5 sm:py-7 ${FOCUS_RING}`}
                >
                  <span className={EYEBROW}>{pad2(i + 1)}</span>
                  <span className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.035em] leading-tight motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-1">
                    {c.label}
                  </span>
                  <span className="flex w-11 h-11 items-center justify-center rounded-full border border-border group-hover:border-foreground transition-colors">
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
