"use client";

import { useState, type UIEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Magnetic from '@/components/studio/Magnetic';
import { openLeadSheet } from '@/lib/lead-sheet';
import { RAIL_ITEM, RAIL_TO_MD, pad2 } from '@/components/studio/ui';
import { WORK, WORK_ROUTE } from '@/lib/work';
import { WorkCover } from '@/components/work/Frames';
import { useCaseOverlay } from '@/components/work/useCaseOverlay';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const RAIL_SM_GUTTER = 'sm:-mx-6 sm:px-6 sm:scroll-px-6';
const CARD_SIZES = { desktop: '(min-width: 1024px) 44vw, (min-width: 768px) 76vw, 62vw', mobile: '(min-width: 1024px) 13vw, (min-width: 768px) 22vw, 18vw' };

const PortfolioShowcase = () => {
  const { coverRef, openFromCard, overlay } = useCaseOverlay();

  const [activeSlide, setActiveSlide] = useState(0);
  const lastSlide = WORK.length - 1;
  const trackSlide = (e: UIEvent<HTMLOListElement>) => {
    const rail = e.currentTarget;
    const range = rail.scrollWidth - rail.clientWidth;
    if (range > 0) setActiveSlide(Math.round((rail.scrollLeft / range) * lastSlide));
  };

  return (
    <section id="work" className="relative overflow-hidden bg-background text-foreground py-14 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-12 lg:items-end mb-8 md:mb-20">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-3 md:mb-5">(01) Selected work</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.98] tracking-[-0.04em]">
              Work that <span className="text-primary">stays</span> with people.
            </h2>
          </div>
          <p className="lg:col-span-4 lg:col-start-9 text-base md:text-lg text-muted-foreground leading-relaxed">
            A few recent projects, each made to be recognised at a glance.
          </p>
        </div>

        {/* Case studies: alternating editorial rows */}
        <ol onScroll={trackSlide} className={`${RAIL_TO_MD} ${RAIL_SM_GUTTER} md:block md:space-y-24`}>
          {WORK.map((project, index) => {
            const flipped = index % 2 === 1;
            const [lead] = project.outcomes;
            return (
              <li key={project.slug} className={`${RAIL_ITEM} md:w-auto`}>
                <article className="group relative grid gap-4 md:gap-8 lg:grid-cols-12 lg:gap-12 lg:items-center">
                  <div
                    ref={coverRef(project.slug)}
                    data-cursor
                    className={`relative overflow-hidden rounded-[22px] aspect-[4/3] lg:col-span-7 ${flipped ? 'lg:col-start-6 lg:row-start-1' : ''}`}
                  >
                    <WorkCover
                      project={project}
                      sizes={CARD_SIZES}
                      className="h-full w-full motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className={`lg:col-span-5 ${flipped ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2 md:mb-4">
                      {pad2(index + 1)} / {project.discipline}
                    </p>
                    <h3 className="font-display text-3xl md:text-5xl font-bold leading-none tracking-[-0.04em]">
                      {/* Stretched link: the whole row opens the case study */}
                      <Link
                        href={`${WORK_ROUTE}/${project.slug}`}
                        onClick={(e) => openFromCard(e, project.slug)}
                        className={`text-left before:absolute before:inset-0 before:z-10 before:rounded-[22px] rounded-sm ${FOCUS_RING}`}
                      >
                        {project.client}
                        <span className="sr-only">, view case study</span>
                      </Link>
                    </h3>
                    <p className="mt-3 hidden md:block text-lg text-muted-foreground max-w-md">{project.headline}</p>
                    <p className="mt-2 md:mt-6 text-lg md:text-2xl font-display font-semibold tracking-[-0.03em]">
                      {lead.value} <span className="font-medium text-muted-foreground">{lead.label.toLowerCase()}</span>
                    </p>
                    <p className="mt-3 hidden md:block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground leading-relaxed">
                      {project.services.join(' / ')}
                    </p>

                    <span aria-hidden="true" className="mt-4 md:mt-8 inline-flex items-center gap-2 text-[15px] font-semibold">
                      <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current after:origin-right after:scale-x-0 after:transition-transform after:[transition-duration:600ms] group-hover:after:origin-left group-hover:after:scale-x-100">
                        View case
                      </span>
                      <ArrowUpRight className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <div aria-hidden="true" className="md:hidden mt-5 flex items-center gap-4">
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {pad2(activeSlide + 1)} / {pad2(WORK.length)}
          </span>
          <span className="flex flex-1 gap-1.5">
            {WORK.map((project, index) => (
              <span
                key={project.slug}
                className={`h-px flex-1 motion-safe:transition-colors motion-safe:duration-500 ${index === activeSlide ? 'bg-foreground' : 'bg-border'}`}
              />
            ))}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-12 md:mt-28 pt-8 md:pt-12 border-t border-border grid gap-6 md:gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h3 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.04em] leading-[1.02]">
              Have a project in mind?
            </h3>
            <p className="mt-3 md:mt-4 text-muted-foreground text-base md:text-lg max-w-xl">
              Tell us what you&apos;re making. We&apos;ll come back with a clear scope, timeline and fixed price.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 lg:justify-end">
            <Magnetic>
              <Link
                href="/portfolio"
                className={`btn-ink h-14 px-7 border border-foreground/20 text-foreground rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap ${FOCUS_RING}`}
              >
                See all work
              </Link>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={openLeadSheet}
                className={`btn-ink btn-ink-invert h-14 px-7 bg-primary text-primary-foreground rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap group/cta ${FOCUS_RING}`}
              >
                Start a project
                <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform duration-500 group-hover/cta:translate-x-1" />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      {overlay}
    </section>
  );
};

export default PortfolioShowcase;
