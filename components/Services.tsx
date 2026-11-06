"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Magnetic from "./studio/Magnetic";
import { openLeadSheet } from '@/lib/lead-sheet';

interface Service {
  title: string;
  desc: string;
  href: string;
}

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const SERVICES_URL = "/services";

const services: Service[] = [
  { title: "Brand identity", desc: "Name, logo, voice and a system that scales", href: SERVICES_URL },
  { title: "Websites", desc: "Designed and built in-house, never from a template", href: "/web" },
  { title: "Shopify stores", desc: "Built to sell across borders and currencies", href: "/shopify" },
  { title: "Packaging", desc: "Shelf-ready design that looks as good online", href: SERVICES_URL },
  { title: "Partner plan", desc: "A senior designer and developer on call, monthly", href: "/#pricing" },
];

/** `headingLevel` lets the /services page own the h1; on the homepage this stays an h2. */
const Services = ({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) => {
  const Heading = headingLevel;
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-14 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-3 sm:gap-6 lg:grid-cols-12 lg:items-end mb-6 sm:mb-16">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-3 sm:mb-5">(02) Services</p>
            <Heading className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.98] tracking-[-0.04em]">
              Three things, <span className="text-primary">done properly</span>.
            </Heading>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link href={SERVICES_URL} className={`inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold rounded-sm ${FOCUS_RING}`}>
              <span className="link-draw">Explore all services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Numbered service list */}
        <ul className="border-t border-border">
          {services.map((s, i) => (
            <li key={s.title} className="border-b border-border">
              <Link
                href={s.href}
                className={`group grid grid-cols-[2.25rem_1fr_auto] sm:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-x-3 sm:gap-x-6 min-h-16 py-2 sm:py-7 ${FOCUS_RING}`}
              >
                <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[1.375rem] sm:text-3xl font-semibold tracking-[-0.035em] leading-tight motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-1">
                    {s.title}
                  </span>
                </span>
                <span className="hidden sm:block text-base text-muted-foreground">{s.desc}</span>
                <span className="relative flex w-9 h-9 sm:w-11 sm:h-11 items-center justify-center overflow-hidden rounded-full border border-border group-hover:border-foreground transition-colors">
                  <ArrowUpRight className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-6 motion-safe:group-hover:-translate-y-6" aria-hidden="true" />
                  <ArrowUpRight className="absolute w-4 h-4 -translate-x-6 translate-y-6 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-0 motion-safe:group-hover:translate-y-0" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Bundle line + quote */}
        <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
          <p className="text-[15px] sm:text-lg text-foreground">
            One small senior team, from first sketch to launch<span className="text-muted-foreground"> · Fixed quote before we start</span>
          </p>
          <Magnetic>
            <button
              type="button"
              onClick={openLeadSheet}
              className={`btn-ink btn-ink-invert h-14 px-7 bg-foreground text-background rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap group/cta ${FOCUS_RING}`}
            >
              Get a fixed quote
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" />
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};

export default Services;
