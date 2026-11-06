"use client";

import { useState } from 'react';
import { Plus, ArrowUpRight } from 'lucide-react';
import Script from 'next/script';
import { PAYMENT_TERMS } from '@/lib/pricing';

const faqs = [
  {
    q: "I don't know anything about ads or marketing. Can you still help?",
    a: "Absolutely. That's exactly who we work with. You focus on running your business. We handle everything — from building your website to creating ads to managing your social media. No technical knowledge needed.",
  },
  {
    q: "How do you price projects?",
    a: `Every type of project has a published starting price, shown in your currency in the pricing section. ${PAYMENT_TERMS}`,
  },
  {
    q: "Am I locked into a contract?",
    a: "No. Projects are fixed-price with a clear scope, so you know the total before we start. Our monthly partner plan can be cancelled with 30 days' notice.",
  },
  {
    q: "How long does a project take?",
    a: "Brand identity takes 3 to 4 weeks, a website 4 to 6 weeks and a Shopify store 5 to 8 weeks. Your quote includes a timeline with milestones, and we work during your business hours.",
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

const WHATSAPP_QUESTION_HREF = 'https://wa.me/919832078313?text=Hi%2C%20I%20have%20a%20question';

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-20 sm:py-28">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.85fr,1.15fr] gap-12 lg:gap-20 items-start">
          {/* Left: sticky heading */}
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5">(07) Questions</p>
            <h2 id="faq-title" className="font-display text-[2.3rem] leading-[1] sm:text-6xl font-semibold tracking-[-0.04em] text-foreground">
              Common questions
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-sm">
              Everything you need to know before getting started
            </p>

            <div className="mt-10 pt-6 border-t border-border max-w-sm">
              <p className="font-display text-xl font-semibold tracking-[-0.03em] text-foreground">Still have questions?</p>
              <p className="mt-1 text-sm text-muted-foreground">We reply in under 2 hours on WhatsApp</p>
              <a
                href={WHATSAPP_QUESTION_HREF}
                target="_blank"
                rel="noopener noreferrer"
                data-track-source="faq"
                className="group mt-3 inline-flex items-center gap-2 min-h-[44px] text-[15px] font-semibold text-primary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="link-draw">Chat on WhatsApp</span>
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
                      className="group w-full flex items-start justify-between gap-6 py-6 sm:py-7 text-left min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    >
                      <span className="flex items-start gap-4 sm:gap-6 min-w-0">
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground pt-1.5 sm:pt-2 w-6 flex-shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-lg sm:text-xl lg:text-[1.4rem] font-semibold leading-snug tracking-[-0.025em] text-foreground">
                          {faq.q}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-[transform,background-color,color,border-color] duration-500 ${
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
                    className="pb-7 pl-10 sm:pl-12 pr-12"
                  >
                    <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-2xl">{faq.a}</p>
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
