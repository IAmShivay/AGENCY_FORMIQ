"use client";

import { ArrowRight } from 'lucide-react';
import Marquee from '@/components/studio/Marquee';
import Magnetic from '@/components/studio/Magnetic';
import { startingFromLabel } from '@/lib/pricing';
import { useCurrency } from '@/lib/use-currency';
import { openLeadSheet } from '@/lib/lead-sheet';
import { ENQUIRY_EMAIL, ENQUIRY_REPLY_PROMISE } from '@/lib/enquiry-options';

const KINETIC_WORDS = ['Brand identity', 'Websites', 'Shopify stores', 'Packaging'];
const EMAIL_HREF = `mailto:${ENQUIRY_EMAIL}`;

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Closing call to action. Colours come from the wrapping tone (ember on the homepage). */
const FinalCTA = () => {
  const [currency] = useCurrency();
  return (
    <section aria-labelledby="final-cta-title" className="relative overflow-hidden" data-no-reveal>
      {/* Kinetic band: speeds up and leans with your scroll */}
      <div className="hidden md:block border-b border-border py-5 sm:py-7">
        <Marquee speed={32}>
          {KINETIC_WORDS.map((t) => (
            <span key={t} className="flex items-center font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.045em] leading-[1.1] pb-[0.08em] text-foreground">
              {t}
              <span aria-hidden="true" className="mx-6 sm:mx-10 font-normal text-foreground/40">/</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4 md:mb-6">Next step</p>
        <h2 id="final-cta-title" className="font-display text-[2.6rem] leading-[0.95] min-[400px]:text-[2.9rem] sm:text-8xl lg:text-[8.5rem] font-bold tracking-[-0.055em] text-foreground max-w-6xl">
          Let&rsquo;s make something people <span className="text-primary">remember</span>.
        </h2>

        <div className="mt-8 md:mt-16 pt-6 md:pt-8 border-t border-border grid lg:grid-cols-[1fr,auto] gap-6 md:gap-8 lg:gap-16 items-end">
          <div className="space-y-3">
            <p className="text-base sm:text-lg text-foreground/80 max-w-xl">
              <span className="text-foreground font-semibold underline decoration-1 underline-offset-4">{startingFromLabel(currency)}.</span> Fixed quote after a 30-minute call.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] leading-relaxed text-muted-foreground">
              Fixed price · Clear timeline · You own everything
            </p>
            <p className="text-sm text-muted-foreground">
              Or email{' '}
              <a href={EMAIL_HREF} data-track-source="final-cta" className={`text-foreground font-medium rounded-sm ${FOCUS_RING}`}>
                <span className="link-draw">{ENQUIRY_EMAIL}</span>
              </a>{' '}
              · We reply {ENQUIRY_REPLY_PROMISE}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Magnetic>
              <button
                type="button"
                onClick={openLeadSheet}
                data-track-source="final-cta"
                className={`btn-ink btn-ink-invert group h-14 px-8 bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center gap-2 text-[15px] whitespace-nowrap ${FOCUS_RING}`}
              >
                Start a project
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={EMAIL_HREF}
                data-track-source="final-cta"
                className={`btn-ink h-14 px-8 border border-foreground/30 text-foreground rounded-full font-semibold flex items-center justify-center gap-2 text-[15px] whitespace-nowrap ${FOCUS_RING}`}
              >
                Email us
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
