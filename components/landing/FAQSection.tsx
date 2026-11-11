"use client";

import { useState } from 'react';
import { Plus, ArrowUpRight } from 'lucide-react';
import Script from 'next/script';
import { ENQUIRY_EMAIL } from '@/lib/enquiry-options';
import { CLIENT_REGIONS_PHRASE } from '@/lib/studio-facts';

const faqs = [
  {
    q: "Do you work with clients outside India?",
    a: `Yes. We work with companies in ${CLIENT_REGIONS_PHRASE}. We run projects remotely with live review calls and a shared project board.`,
  },
  {
    q: "Which time zones do you cover?",
    a: "We overlap with UK and European mornings, Gulf business hours and US East Coast mornings, so reviews happen in your day, not at midnight.",
  },
  {
    q: "Who owns the files and the code?",
    a: "You do. On final payment you get every source file, font licence note, repository and account. Nothing is held back.",
  },
  {
    q: "How do payments work?",
    a: "Fixed price, 50% to start and 50% at launch. We invoice in EUR, GBP, AED, USD or INR.",
  },
  {
    q: "Can you work with our in-house team?",
    a: "Yes. We often design and build alongside in-house marketers and developers, and hand over clean, documented work.",
  },
  {
    q: "What happens after launch?",
    a: "Every project includes 30 days of care for fixes. After that, the partner plan keeps a senior designer and developer on call each month.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a,
    },
  })),
};

const EMAIL_QUESTION_HREF = `mailto:${ENQUIRY_EMAIL}`;

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative pt-10 pb-14 sm:py-28">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.85fr,1.15fr] gap-8 md:gap-12 lg:gap-20 items-start">
          {/* Left: sticky heading */}
          <div className="lg:sticky lg:top-28 max-md:contents">
            <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3 md:mb-5">(06) Questions</p>
            <h2 id="faq-title" className="font-display text-[2.3rem] leading-[1] sm:text-6xl font-semibold tracking-[-0.04em] text-foreground">
              Before you <span className="text-primary">ask</span>.
            </h2>
            <p className="mt-3 md:mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-sm">
              The things international clients usually want to know first.
            </p>
            </div>

            <div className="mt-10 pt-6 border-t border-border max-w-sm max-md:order-last max-md:-mt-2 max-md:pt-0 max-md:border-t-0 max-md:flex max-md:flex-wrap max-md:items-center max-md:justify-between max-md:gap-x-4 max-md:max-w-none">
              <div>
              <p className="font-display text-lg md:text-xl font-semibold tracking-[-0.03em] text-foreground">Still have questions?</p>
              <p className="mt-1 text-sm text-muted-foreground">We reply within one working day.</p>
              </div>
              <a
                href={EMAIL_QUESTION_HREF}
                data-track-source="faq"
                className="group mt-3 max-md:mt-0 inline-flex items-center gap-2 min-h-[44px] text-[15px] font-semibold text-primary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="link-draw">Email the studio</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* Right: accordion */}
          <dl className="border-t border-border">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              const panelId = `faq-panel-${i}`;
              const buttonId = `faq-button-${i}`;
              return (
                <div key={i} className="border-b border-border">
                  <dt>
                    <button
                      id={buttonId}
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group w-full flex items-start justify-between gap-4 sm:gap-6 py-4 sm:py-7 text-left min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    >
                      <span className="flex items-start gap-3 sm:gap-6 min-w-0">
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground pt-1 sm:pt-2 w-6 flex-shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-base sm:text-xl lg:text-[1.4rem] font-semibold leading-snug tracking-[-0.025em] text-foreground">
                          {faq.q}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`md:mt-0.5 w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-[transform,background-color,color,border-color] duration-500 ${
                          isOpen ? 'rotate-45 bg-foreground text-background border-foreground' : 'border-border text-foreground group-hover:border-foreground/40'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </span>
                    </button>
                  </dt>
                  <dd
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="pb-5 md:pb-7 pl-9 sm:pl-12 pr-2 md:pr-12"
                  >
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">{faq.a}</p>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
