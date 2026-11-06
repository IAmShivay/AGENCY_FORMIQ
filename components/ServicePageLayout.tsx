'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import ContactForm from './landing/ContactForm';
import Magnetic from './studio/Magnetic';
import { BTN_OUTLINE, BTN_PRIMARY, CONTAINER, EYEBROW, FOCUS_RING, H1, H2, SECTION_Y, pad2 } from './studio/ui';
import { openLeadSheet } from '@/lib/lead-sheet';

interface ServiceFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

interface ProcessStep {
  title: string;
  description: string;
  icon: LucideIcon;
  tools: string[];
  benefits: string;
}

interface Highlight {
  name: string;
  description: string;
  features: string[];
  /** Legacy gradient classes; ignored (the page follows the theme). */
  color?: string;
}

interface ServicePageLayoutProps {
  badge: string;
  badgeIcon: LucideIcon;
  title: string;
  titleAccent: string;
  subtitle: string;
  highlights?: Highlight[];
  services: ServiceFeature[];
  servicesTitle: string;
  servicesSubtitle: string;
  process: ProcessStep[];
  processTitle: string;
  processSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaIcon: LucideIcon;
}

const CONTACT_HREF = '/contact';
const PORTFOLIO_HREF = '/portfolio';

/** Shared template for the service pages (/web, /mobile, /shopify, /marketing, /ecommerce-marketplace, /agents). */
export default function ServicePageLayout({
  badge,
  title,
  titleAccent,
  subtitle,
  highlights,
  services,
  servicesTitle,
  servicesSubtitle,
  process,
  processTitle,
  processSubtitle,
  ctaTitle,
  ctaSubtitle,
}: ServicePageLayoutProps) {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24">
        <div className={CONTAINER}>
          <p className={`${EYEBROW} mb-6`}>(01) {badge}</p>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className={`${H1} lg:col-span-8 break-words`}>
              <span className="text-primary">{titleAccent}</span> {title}
            </h1>
            <div className="lg:col-span-4 space-y-8">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
              <div className="flex flex-col min-[420px]:flex-row gap-3">
                <Magnetic>
                  <button type="button" onClick={openLeadSheet} className={BTN_PRIMARY}>
                    Get started
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden="true" />
                  </button>
                </Magnetic>
                <Magnetic>
                  <Link href={PORTFOLIO_HREF} className={BTN_OUTLINE}>
                    View portfolio
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Highlights: three ruled columns */}
          {highlights && highlights.length > 0 && (
            <ul className="mt-16 sm:mt-20 grid border-t border-border md:grid-cols-3">
              {highlights.map((item, i) => (
                <li
                  key={item.name}
                  className="py-8 border-b border-border md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0 md:[&:not(:first-child)]:border-l"
                >
                  <p className={`${EYEBROW} mb-4`}>{pad2(i + 1)}</p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.035em] leading-tight">{item.name}</h2>
                  <p className="mt-3 text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  <ul className="mt-5 space-y-2">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-baseline gap-3 text-sm text-foreground/80">
                        <span aria-hidden="true" className="h-px w-3 shrink-0 translate-y-[-0.3em] bg-foreground/50" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Services: numbered ruled rows */}
      <section className={`border-t border-border ${SECTION_Y}`}>
        <div className={CONTAINER}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12 sm:mb-16">
            <div className="lg:col-span-7">
              <p className={`${EYEBROW} mb-5`}>(02) Services</p>
              <h2 className={H2}>{servicesTitle}</h2>
            </div>
            <p className="lg:col-span-4 lg:col-start-9 text-base sm:text-lg text-muted-foreground leading-relaxed">{servicesSubtitle}</p>
          </div>

          <ol className="border-t border-border">
            {services.map((service, i) => (
              <li
                key={service.title}
                className="grid grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[4rem_minmax(0,1fr)] lg:grid-cols-[4rem_minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)] gap-x-3 sm:gap-x-6 gap-y-4 py-8 sm:py-10 border-b border-border"
              >
                <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-muted-foreground pt-2">{pad2(i + 1)}</span>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.035em] leading-tight">{service.title}</h3>
                <p className="col-start-2 lg:col-start-auto text-base text-muted-foreground leading-relaxed">{service.description}</p>
                <ul className="col-start-2 lg:col-start-auto space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-baseline gap-3 text-sm text-foreground/80">
                      <span aria-hidden="true" className="h-px w-3 shrink-0 translate-y-[-0.3em] bg-foreground/50" />
                      {f}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Process: large numbers on a sand band */}
      <section className={`tone-sand ${SECTION_Y}`}>
        <div className={CONTAINER}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12 sm:mb-16">
            <div className="lg:col-span-7">
              <p className={`${EYEBROW} mb-5`}>(03) Process</p>
              <h2 className={H2}>{processTitle}</h2>
            </div>
            <p className="lg:col-span-4 lg:col-start-9 text-base sm:text-lg text-muted-foreground leading-relaxed">{processSubtitle}</p>
          </div>

          <ol className="grid border-t border-border md:grid-cols-2">
            {process.map((step, i) => (
              <li
                key={step.title}
                className="py-8 sm:py-10 border-b border-border md:odd:pr-8 md:even:pl-8 md:even:border-l"
              >
                <span aria-hidden="true" className="block font-display text-7xl sm:text-8xl font-medium leading-none tracking-[-0.05em] text-foreground/15">
                  {pad2(i + 1)}
                </span>
                <h3 className="mt-8 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.035em] leading-tight">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-lg">{step.description}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className={`${EYEBROW} mb-3`}>Tools &amp; methods</h4>
                    <ul className="space-y-1.5">
                      {step.tools.map((tool) => (
                        <li key={tool} className="text-sm text-foreground/80">{tool}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className={`${EYEBROW} mb-3`}>Key benefit</h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">{step.benefits}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA band */}
      <section className="tone-ember py-20 sm:py-28">
        <div className={CONTAINER}>
          <p className={`${EYEBROW} mb-6`}>(04) Next step</p>
          <h2 className="font-display text-[2.6rem] leading-[0.98] sm:text-7xl lg:text-8xl font-bold tracking-[-0.05em] max-w-5xl break-words">
            {ctaTitle}
          </h2>
          <div className="mt-10 sm:mt-14 pt-8 border-t border-border grid gap-8 lg:grid-cols-[1fr,auto] lg:items-end">
            <p className="text-base sm:text-lg text-foreground/80 max-w-xl leading-relaxed">{ctaSubtitle}</p>
            <div className="flex flex-col min-[420px]:flex-row gap-3">
              <Magnetic>
                <button type="button" onClick={openLeadSheet} className={BTN_PRIMARY}>
                  Send a brief
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden="true" />
                </button>
              </Magnetic>
              <Link href={CONTACT_HREF} className={`inline-flex min-h-14 items-center justify-center gap-2 px-2 text-[15px] font-semibold rounded-sm ${FOCUS_RING}`}>
                <span className="link-draw">Contact page</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brief form */}
      <ContactForm />
    </div>
  );
}
