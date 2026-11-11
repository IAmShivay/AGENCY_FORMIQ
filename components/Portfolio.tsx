"use client";

import { useState, useEffect, useMemo, useRef, type MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from './studio/PageHeader';
import { BTN_EMBER, BTN_OUTLINE, CONTAINER, EYEBROW, FOCUS_RING, H2, SECTION_Y, pad2 } from './studio/ui';
import { WorkCover } from './work/Frames';
import { useCaseOverlay } from './work/useCaseOverlay';
import { gsap, prefersReducedMotion } from '@/lib/studio-motion';
import { openLeadSheet } from '@/lib/lead-sheet';
import { WORK, WORK_ROUTE } from '@/lib/work';
import { caseHref, loadSection, type SectionKey } from '@/lib/portfolio-cases';
import { NO_YEAR } from '@/lib/portfolio-format';

interface IndexItem {
  id: string;
  title: string;
  discipline: string;
  year: string;
  image: string;
  link: string;
}

const ALL = 'All';
const COVER_SIZES = { desktop: '(min-width: 768px) 44vw, 92vw', mobile: '(min-width: 768px) 11vw, 22vw' };
const ROW_IN = { y: 24, duration: 0.7, stagger: 0.05, ease: 'expo.out' };
const PREVIEW = { width: 320, offset: 24, follow: 0.45, fade: 0.25 };
const DISCIPLINE_LABEL: Record<string, string> = { 'e-commerce': 'E-commerce', corporate: 'Corporate site', 'ui/ux': 'UI/UX design' };
const INDEX_SECTIONS: SectionKey[] = ['websites', 'applications', 'design', 'creatives', 'ads-seo'];

const Portfolio = () => {
  const { coverRef, openFromCard, overlay } = useCaseOverlay();
  const [items, setItems] = useState<IndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(ALL);
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<IndexItem | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const follow = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useEffect(() => {
    Promise.all(INDEX_SECTIONS.map(loadSection))
      .then((groups) => {
        const all: IndexItem[] = groups.flat().map((c) => ({
          id: c.id, title: c.title, discipline: DISCIPLINE_LABEL[c.discipline.toLowerCase()] ?? c.discipline, year: c.year || NO_YEAR, image: c.image, link: caseHref(c),
        }));
        setItems(all.filter((item, i, self) => i === self.findIndex((t) => t.id === item.id)));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || prefersReducedMotion()) return;
    follow.current = {
      x: gsap.quickTo(el, 'x', { duration: PREVIEW.follow, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: PREVIEW.follow, ease: 'power3.out' }),
    };
  }, []);

  useEffect(() => {
    const rows = listRef.current?.children;
    if (!rows?.length || prefersReducedMotion()) return;
    const tween = gsap.fromTo(rows, { autoAlpha: 0, y: ROW_IN.y }, { autoAlpha: 1, y: 0, duration: ROW_IN.duration, stagger: ROW_IN.stagger, ease: ROW_IN.ease });
    return () => { tween.kill(); };
  }, [items, filter]);

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((i) => counts.set(i.discipline, (counts.get(i.discipline) ?? 0) + 1));
    return [{ label: ALL, count: items.length }, ...Array.from(counts, ([label, count]) => ({ label, count }))];
  }, [items]);

  const visible = filter === ALL ? items : items.filter((i) => i.discipline === filter);
  const showPreview = !!hovered?.image && !broken.has(hovered.id);

  const movePreview = (e: MouseEvent) => {
    const x = e.clientX + PREVIEW.offset;
    const y = e.clientY - PREVIEW.width * 0.375;
    if (follow.current) { follow.current.x(x); follow.current.y(y); }
    else if (previewRef.current) previewRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const show = showPreview;
    if (prefersReducedMotion()) { el.style.opacity = show ? '1' : '0'; return; }
    gsap.to(el, { autoAlpha: show ? 1 : 0, scale: show ? 1 : 0.92, duration: PREVIEW.fade, ease: 'power2.out' });
  }, [showPreview]);

  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="(01) Work"
        title={<>Selected <span className="text-primary">work</span></>}
        intro="Brands, storefronts and products we have designed and built, from first sketch to launch."
      />

      {/* Featured case studies */}
      <section aria-labelledby="featured-heading" className="pb-16 sm:pb-24">
        <div className={CONTAINER}>
          <div className="flex items-baseline justify-between border-t border-border pt-5 mb-8 sm:mb-12">
            <h2 id="featured-heading" className={EYEBROW}>Case studies</h2>
            <span className={`${EYEBROW} tabular-nums`}>{pad2(WORK.length)}</span>
          </div>
          <ul className="grid gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16">
            {WORK.map((project, index) => {
              const [lead] = project.outcomes;
              return (
                <li key={project.slug} className={index % 2 === 1 ? 'md:mt-24' : ''}>
                  <article className="group relative">
                    <div ref={coverRef(project.slug)} data-cursor className="relative overflow-hidden rounded-[22px] aspect-[4/3]">
                      <WorkCover
                        project={project}
                        sizes={COVER_SIZES}
                        priority={index === 0}
                        className="h-full w-full motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="mt-5 sm:mt-6 flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <p className={`${EYEBROW} mb-2`}>{pad2(index + 1)} / {project.discipline}</p>
                        <h3 className="font-display text-3xl sm:text-4xl font-bold leading-none tracking-[-0.04em]">
                          <Link
                            href={`${WORK_ROUTE}/${project.slug}`}
                            onClick={(e) => openFromCard(e, project.slug)}
                            className={`before:absolute before:inset-0 before:z-10 before:rounded-[22px] rounded-sm ${FOCUS_RING}`}
                          >
                            {project.client}
                            <span className="sr-only">, view case study</span>
                          </Link>
                        </h3>
                        <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-md">{project.headline}</p>
                      </div>
                      <span aria-hidden="true" className="mt-6 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-border motion-safe:transition-colors group-hover:bg-foreground group-hover:text-background group-hover:border-foreground">
                        <ArrowUpRight className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-500 group-hover:rotate-45" />
                      </span>
                    </div>
                    <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
                      <div>
                        <dt className={EYEBROW}>Services</dt>
                        <dd className="mt-1 text-sm">{project.services.join(', ')}</dd>
                      </div>
                      <div>
                        <dt className={EYEBROW}>Result</dt>
                        <dd className="mt-1 text-sm"><span className="font-semibold">{lead.value}</span> <span className="text-muted-foreground">{lead.label.toLowerCase()}</span></dd>
                      </div>
                    </dl>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Project index */}
      <section aria-labelledby="index-heading" data-no-reveal className="pb-20 sm:pb-28 lg:pb-32">
        <div className={CONTAINER}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-8 sm:mb-12">
            <div className="lg:col-span-6">
              <p className={`${EYEBROW} mb-4`}>(02) Index</p>
              <h2 id="index-heading" className={H2}>More projects</h2>
            </div>
            {filters.length > 2 && (
              <div role="group" aria-label="Filter projects" className="lg:col-span-6 flex flex-wrap gap-2 lg:justify-end">
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
            )}
          </div>

          <div aria-hidden="true" className={`hidden sm:grid grid-cols-[4rem_minmax(0,1fr)_14rem_6rem_2.75rem] gap-x-6 pb-3 border-b border-foreground ${EYEBROW}`}>
            <span>No.</span><span>Project</span><span>Discipline</span><span>Year</span><span />
          </div>

          {loading && (
            <p role="status" className="py-10 text-muted-foreground">Loading projects…</p>
          )}

          {!loading && visible.length === 0 && (
            <p className="py-10 text-muted-foreground border-b border-border">New projects are being written up. Ask us for the full deck.</p>
          )}

          {!loading && visible.length > 0 && (
            <ul ref={listRef} onMouseLeave={() => setHovered(null)} onMouseMove={movePreview}>
              {visible.map((item, i) => {
                const row = (
                  <>
                    <span className={`${EYEBROW} tabular-nums`}>{pad2(i + 1)}</span>
                    <span className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[-0.035em] leading-tight motion-safe:transition-transform motion-safe:duration-500 sm:group-hover:translate-x-2">
                      {item.title}
                    </span>
                    <span className="col-start-2 sm:col-start-auto text-sm text-muted-foreground">
                      {item.discipline}<span className="sm:hidden"> · {item.year}</span>
                    </span>
                    <span className="hidden sm:block text-sm text-muted-foreground tabular-nums">{item.year}</span>
                    <span className={`row-span-2 sm:row-span-1 col-start-3 row-start-1 sm:col-start-auto sm:row-start-auto flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors group-hover:bg-foreground group-hover:text-background group-hover:border-foreground`} aria-hidden="true">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </>
                );
                const rowClass = `group grid grid-cols-[2.25rem_minmax(0,1fr)_2.75rem] sm:grid-cols-[4rem_minmax(0,1fr)_14rem_6rem_2.75rem] items-center gap-x-3 sm:gap-x-6 gap-y-1 py-5 sm:py-7 border-b border-border ${FOCUS_RING}`;
                return (
                  <li key={item.id} onMouseEnter={() => setHovered(item)}>
                    <Link href={item.link} className={rowClass}>{row}</Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div
            ref={previewRef}
            aria-hidden="true"
            style={{ width: PREVIEW.width }}
            className="pointer-events-none fixed left-0 top-0 z-50 hidden [@media(hover:hover)_and_(pointer:fine)]:block invisible opacity-0 overflow-hidden rounded-[14px] bg-muted shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] aspect-[4/3]"
          >
            {items.filter((i) => i.image).map((item) => (
              <Image
                key={item.id}
                src={item.image}
                alt=""
                fill
                unoptimized
                sizes={`${PREVIEW.width}px`}
                onError={() => setBroken((b) => new Set(b).add(item.id))}
                className={`object-cover object-top transition-opacity duration-300 ${hovered?.id === item.id ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={`tone-ink ${SECTION_Y}`}>
        <div className={`${CONTAINER} grid gap-8 lg:grid-cols-12 lg:items-end`}>
          <div className="lg:col-span-7">
            <p className={`${EYEBROW} mb-5`}>(03) Next</p>
            <h2 className={H2}>Your project <span className="text-primary">could be next.</span></h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl">
              Tell us what you&apos;re making. We&apos;ll come back with a clear scope, timeline and fixed price.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 lg:justify-end">
            <button type="button" onClick={openLeadSheet} className={BTN_EMBER}>Start a project</button>
            <Link href="/contact" className={BTN_OUTLINE}>Book a call</Link>
          </div>
        </div>
      </section>

      {overlay}
    </div>
  );
};

export default Portfolio;
