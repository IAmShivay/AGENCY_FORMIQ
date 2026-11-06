"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Magnetic from "./studio/Magnetic";

interface Service {
  title: string;
  desc: string;
  href: string;
}

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const WHATSAPP_QUOTE_URL = "https://wa.me/919832078313?text=Hi%2C%20I%20want%20to%20know%20about%20your%20services";
const SERVICES_URL = "/services";

const services: Service[] = [
  { title: "Website", desc: "Premium site that converts", href: "/web" },
  { title: "Meta Ads", desc: "Creatives + targeting + optimisation", href: "/marketing" },
  { title: "Social Media", desc: "12 posts/mo · Reels & stories", href: "/marketing" },
  { title: "Google Ads & SEO", desc: "Top 3 on Google", href: "/marketing" },
  { title: "Google Business", desc: "#1 in Maps", href: "/marketing" },
  { title: "E-commerce", desc: "Store ready to sell", href: "/shopify" },
];

/** `headingLevel` lets the /services page own the h1; on the homepage this stays an h2. */
const Services = ({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) => {
  const Heading = headingLevel;
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12 sm:mb-16">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-5">(02) Services</p>
            <Heading className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.98] tracking-[-0.04em]">
              Everything you need to grow, <span className="text-primary">all included</span>
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
                className={`group grid grid-cols-[2.25rem_1fr_auto] sm:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-x-3 sm:gap-x-6 py-5 sm:py-7 ${FOCUS_RING}`}
              >
                <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl sm:text-3xl font-semibold tracking-[-0.035em] leading-tight motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-1">
                    {s.title}
                  </span>
                  <span className="sm:hidden block mt-1 text-sm text-muted-foreground">{s.desc}</span>
                </span>
                <span className="hidden sm:block text-base text-muted-foreground">{s.desc}</span>
                <span className="relative flex w-11 h-11 items-center justify-center overflow-hidden rounded-full border border-border group-hover:border-foreground transition-colors">
                  <ArrowUpRight className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-6 motion-safe:group-hover:-translate-y-6" aria-hidden="true" />
                  <ArrowUpRight className="absolute w-4 h-4 -translate-x-6 translate-y-6 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-0 motion-safe:group-hover:translate-y-0" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Bundle line + quote */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <p className="text-base sm:text-lg text-foreground">
            One team for design, build and growth<span className="text-muted-foreground"> · Fixed quote before we start</span>
          </p>
          <Magnetic>
            <a
              href={WHATSAPP_QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-ink btn-ink-invert h-14 px-7 bg-foreground text-background rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap group/cta ${FOCUS_RING}`}
            >
              Get a quote
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" />
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};

export default Services;
