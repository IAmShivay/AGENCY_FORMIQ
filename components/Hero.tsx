"use client";

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowDown } from "lucide-react";
import { openLeadSheet } from '@/lib/lead-sheet';
import Magnetic from './studio/Magnetic';
import EmberField from './studio/EmberField';
import StudioClock from './studio/StudioClock';
import { BTN_EMBER, CONTAINER, EYEBROW, FOCUS_RING, pad2 } from './studio/ui';
import { gsap, SplitText, useGSAP, introReady, shouldPlayEntrance } from '@/lib/studio-motion';
import { startingFromLabel } from '@/lib/pricing';
import { useCurrency } from '@/lib/use-currency';

const WORK_ANCHOR = '#work';

const HERO_SERVICES = [
  { label: 'Brand identity', href: '/services' },
  { label: 'Websites', href: '/web' },
  { label: 'Shopify stores', href: '/shopify' },
] as const;

const TITLE = 'font-display text-[clamp(2.9rem,7.6vw,8rem)] font-medium leading-[0.9] text-foreground';
const ACCENT = 'font-serif italic font-normal tracking-[-0.02em] text-foreground';
const LINK = `inline-flex items-center gap-2 min-h-11 text-[15px] font-medium text-foreground rounded-sm ${FOCUS_RING}`;

const Hero = () => {
  const [currency] = useCurrency();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!shouldPlayEntrance()) return;
    gsap.set('[data-hero-title]', { autoAlpha: 0 });
    gsap.set('[data-hero-in]', { y: 24, autoAlpha: 0 });
    gsap.set('[data-hero-field]', { autoAlpha: 0 });
    Promise.all([introReady, document.fonts.ready]).then(() => {
      if (!root.current) return;
      const split = SplitText.create('[data-hero-title]', { type: 'words,lines', mask: 'lines' });
      gsap.set('[data-hero-title]', { autoAlpha: 1 });
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .to('[data-hero-field]', { autoAlpha: 1, duration: 2.4, ease: 'power2.out' }, 0)
        .from(split.words, { yPercent: 110, duration: 1.2, stagger: 0.045 }, 0.1)
        .to('[data-hero-in]', { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.08 }, 0.55);
    });
  }, { scope: root });

  return (
    <div ref={root} data-hero className="tone-ink hero-ember relative isolate w-full overflow-hidden">
      <div data-hero-field aria-hidden="true" className="absolute inset-0 -z-10">
        <EmberField className="absolute inset-0" />
        <div className="grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 md:h-1/2 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className={`${CONTAINER} flex min-h-[100svh] flex-col justify-between pt-24 [@media(max-height:700px)]:pt-20 sm:pt-32 lg:pt-36 pb-5 sm:pb-8`}>
        <h1 data-hero-title className={`max-w-[13ch] lg:max-w-[14ch] ${TITLE} max-md:text-[12.6vw] [@media(max-height:700px)]:!text-[2.5rem]`}>
          We design and build brands, websites and stores people <span className={ACCENT}>remember.</span>
        </h1>

        <div className="mt-8 sm:mt-16">
          <div className="grid grid-cols-1 gap-y-6 md:gap-y-10 gap-x-8 border-t border-foreground/15 pt-6 sm:pt-8 md:grid-cols-12">
            <nav data-hero-in aria-label="Services" className="hidden md:block md:col-span-4 lg:col-span-3">
              <p className={EYEBROW}>What we do</p>
              <ul className="mt-3">
                {HERO_SERVICES.map((s, i) => (
                  <li key={s.href}>
                    <Link href={s.href} className={`lg:min-h-9 ${LINK}`}>
                      <span className="font-mono text-[11px] text-muted-foreground">{pad2(i + 1)}</span>
                      <span className="link-draw">{s.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div data-hero-in className="md:col-span-8 lg:col-span-5">
              <p className={`hidden md:block ${EYEBROW}`}>Studio</p>
              <p className="md:mt-4 max-w-[38ch] text-[17px] sm:text-xl leading-relaxed text-foreground">
                An independent studio working with growing companies across Europe, the UK, the UAE and India.
              </p>
              <p className="mt-3 md:mt-4 text-[15px] text-muted-foreground">{startingFromLabel(currency)}, quoted at a fixed price.</p>
            </div>

            <div data-hero-in className="md:col-span-12 lg:col-span-4 flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end lg:justify-end">
              <Magnetic>
                <button type="button" onClick={openLeadSheet} className={`${BTN_EMBER} w-full sm:w-auto`}>
                  Start a project
                  <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform duration-500 group-hover/cta:translate-x-1" />
                </button>
              </Magnetic>
            </div>
          </div>

          <div data-hero-in className={`mt-4 sm:mt-8 flex items-center justify-between gap-6 ${EYEBROW}`}>
            <StudioClock />
            <a href={WORK_ANCHOR} className={`inline-flex items-center gap-2 min-h-11 text-foreground rounded-sm ${FOCUS_RING}`}>
              <span className="link-draw">Selected work</span>
              <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Hero;
