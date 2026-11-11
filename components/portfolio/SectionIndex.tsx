"use client";

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '@/components/studio/PageHeader';
import PageCTA from '@/components/studio/PageCTA';
import RevealImage from './RevealImage';
import { CONTAINER, EYEBROW, FOCUS_RING, pad2 } from '@/components/studio/ui';
import { SECTIONS, caseHref, loadSection, type CaseItem, type SectionKey } from '@/lib/portfolio-cases';
import { PORTFOLIO_ROUTE, NO_YEAR, initials, isNamedClient } from '@/lib/portfolio-format';

const ALL = 'All';
const CARD_SIZES = '(min-width: 768px) 46vw, 92vw';

interface SectionIndexProps {
  section: SectionKey;
  title: ReactNode;
  intro: string;
  cta: { title: string; subtitle: string; primary: string };
}

export default function SectionIndex({ section, title, intro, cta }: SectionIndexProps) {
  const config = SECTIONS[section];
  const [items, setItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(ALL);

  useEffect(() => {
    loadSection(section).then(setItems).finally(() => setLoading(false));
  }, [section]);

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((i) => counts.set(i.discipline, (counts.get(i.discipline) ?? 0) + 1));
    return [{ label: ALL, count: items.length }, ...Array.from(counts, ([label, count]) => ({ label, count }))];
  }, [items]);

  const visible = filter === ALL ? items : items.filter((i) => i.discipline === filter);

  return (
    <div className="bg-background text-foreground">
      <PageHeader eyebrow={`(01) Work / ${config.label}`} title={title} intro={intro} />

      <section data-no-reveal className="pb-20 sm:pb-28 lg:pb-32">
        <div className={CONTAINER}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 mb-10 sm:mb-14">
            {filters.length > 2 ? (
              <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
                {filters.map((f) => {
                  const active = filter === f.label;
                  return (
                    <button
                      key={f.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(f.label)}
                      className={`min-h-11 px-4 rounded-full text-sm font-medium border transition-colors duration-300 ${FOCUS_RING} ${
                        active ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
                      }`}
                    >
                      {f.label} <sup className="ml-0.5 font-mono text-[10px] tabular-nums">{f.count}</sup>
                    </button>
                  );
                })}
              </div>
            ) : <span />}
            {!loading && <span className={`${EYEBROW} tabular-nums`}>{pad2(visible.length)} {visible.length === 1 ? 'project' : 'projects'}</span>}
          </div>

          {loading && <p role="status" className="py-10 text-muted-foreground">Loading projects…</p>}

          {!loading && visible.length === 0 && (
            <div className="grid gap-6 border-b border-border pb-14 lg:grid-cols-12">
              <p className="lg:col-span-7 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] leading-tight">
                We&apos;re writing up our latest {config.singular} work. Ask us for the private deck in the meantime.
              </p>
              <div className="lg:col-span-4 lg:col-start-9 flex lg:justify-end">
                <Link href={PORTFOLIO_ROUTE} className={`inline-flex min-h-11 items-center gap-2 font-semibold rounded-sm ${FOCUS_RING}`}>
                  <span className="link-draw">See all work</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}

          {!loading && visible.length > 0 && (
            <ul key={filter} className="grid gap-x-8 gap-y-14 sm:gap-y-20 md:grid-cols-2">
              {visible.map((item, index) => (
                <li key={item.id} className={index % 2 === 1 ? 'md:mt-28' : ''}>
                  <article className="group relative">
                    <RevealImage
                      src={item.image}
                      alt={`${item.title}, ${config.singular}`}
                      sizes={CARD_SIZES}
                      fallback={initials(item.title)}
                      priority={index < 2}
                      className="aspect-[4/3] rounded-[22px] group-hover:[&_[data-frame]]:-translate-y-2"
                    />
                    <div className="mt-5 sm:mt-6 flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <p className={`${EYEBROW} mb-2`}>
                          {[pad2(index + 1), isNamedClient(item.client) ? item.client : item.discipline, item.year && item.year !== NO_YEAR ? item.year : ''].filter(Boolean).join(' / ')}
                        </p>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.04em]">
                          <Link href={caseHref(item)} className={`before:absolute before:inset-0 before:z-10 before:rounded-[22px] rounded-sm ${FOCUS_RING}`}>
                            {item.title}
                            <span className="sr-only">, view case study</span>
                          </Link>
                        </h2>
                        <p className="mt-3 text-base text-muted-foreground line-clamp-2 max-w-md">{item.summary}</p>
                        {item.tags.length > 0 && (
                          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{item.tags.slice(0, 4).join(' / ')}</p>
                        )}
                      </div>
                      <span aria-hidden="true" className="mt-6 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-border motion-safe:transition-colors group-hover:bg-foreground group-hover:text-background group-hover:border-foreground">
                        <ArrowUpRight className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-500 group-hover:rotate-45" />
                      </span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <PageCTA title={cta.title} subtitle={cta.subtitle} primary={{ label: cta.primary }} secondary={{ label: 'View all work', href: PORTFOLIO_ROUTE }} />
    </div>
  );
}
