"use client";

import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import Script from 'next/script';

const faqs = [
  {
    q: "I don't know anything about ads or marketing. Can you still help?",
    a: "Absolutely. That's exactly who we work with. You focus on running your business. We handle everything — from building your website to creating ads to managing your social media. No technical knowledge needed.",
  },
  {
    q: "What's included in the Rs 6,999/month Growth Plan?",
    a: "Everything you need to grow online: a professional website (built and maintained), Facebook & Instagram ad campaigns, social media management (12 posts/month), Google My Business optimization, a dedicated account manager, and monthly performance reports with real numbers.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no lock-in. If you're not happy, you can cancel at the end of any month. We believe in earning your business every month, not trapping you in a contract.",
  },
  {
    q: "How quickly will I see results?",
    a: "Your website will be live in 15 days. Ad campaigns typically start showing results within the first week. Most of our clients see a noticeable increase in enquiries within the first month.",
  },
  {
    q: "How much should I spend on ads separately?",
    a: "We recommend starting with Rs 5,000-10,000/month on ad spend (paid directly to Facebook/Google). This is separate from our service fee. We'll help you decide the right budget based on your business and goals.",
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

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-8 sm:py-12 md:py-16 bg-background relative overflow-hidden">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/15 text-xs font-semibold tracking-widest text-primary uppercase mb-3">
            <HelpCircle className="w-3 h-3" /> FAQ
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-foreground tracking-tight">
            Common Questions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Everything you need to know before getting started
          </p>
        </div>

        <dl className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isOpen ? 'bg-card border-primary/20 shadow-md shadow-primary/5' : 'bg-card border-border hover:border-primary/15 hover:shadow-sm'
                }`}
              >
                <dt>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-sm sm:text-[15px] font-semibold leading-snug ${isOpen ? 'text-foreground' : 'text-foreground'}`}>{faq.q}</span>
                    </div>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? 'bg-primary text-primary-foreground rotate-180' : 'bg-muted text-muted-foreground'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                </dt>
                {isOpen && (
                  <dd className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="sm:ml-10 pl-0 sm:pl-0 border-l-0 sm:border-l-2 border-primary/10 sm:pl-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </dd>
                )}
              </div>
            );
          })}
        </dl>

        <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Still have questions?</p>
              <p className="text-xs text-muted-foreground">We reply in under 2 hours on WhatsApp</p>
            </div>
          </div>
          <a href="https://wa.me/919832078313?text=Hi%2C%20I%20have%20a%20question" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md">
              Chat on WhatsApp
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
