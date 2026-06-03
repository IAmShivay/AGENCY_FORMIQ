"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Globe,
  Smartphone,
  PaintBucket,
  ExternalLink,
  ArrowRight,
  Loader2,
} from 'lucide-react';
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
    if (type === 'website') return <Globe className="w-4 h-4" />;
    if (type === 'app') return <Smartphone className="w-4 h-4" />;
    return <PaintBucket className="w-4 h-4" />;
  };

  return (
    <section className="py-12 md:py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Work</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Projects that showcase our commitment to quality and innovation.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map(item => (
              <div key={item.id} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {/* Image */}
                <div className="relative h-36 sm:h-48 bg-secondary/30">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {typeIcon(item.type)}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-card/90 text-xs font-medium text-primary border border-border capitalize">
                    {item.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  {item.link && item.link !== '#' && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                      <ExternalLink className="w-3 h-3" /> View Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No projects found.</p>
        )}

        {/* CTA */}
        <div className="text-center mt-8">
          <Link href="/portfolio">
            <button className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200">
              View All Projects <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
