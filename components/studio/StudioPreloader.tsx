'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion, markIntroReady } from '@/lib/studio-motion';
import Wordmark, { wordmarkIn, wordmarkOut } from './Wordmark';

const INTRO_KEY = 'formiq-intro';
const COUNT_DIGITS = 3;
export const LOGO_PENDING_CLASS = 'logo-pending';

export default function StudioPreloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(() => {
    const html = document.documentElement;
    if (html.classList.contains('intro-seen') || prefersReducedMotion()) {
      markIntroReady(); setDone(true); return;
    }
    try { sessionStorage.setItem(INTRO_KEY, '1'); } catch { /* storage blocked */ }
    html.style.overflow = 'hidden';
    const el = root.current!;
    const num = el.querySelector<HTMLElement>('[data-count]')!;
    const mark = el.querySelector('.wordmark')!;
    const spark = el.querySelector('[data-wm-dot]')!;
    const burst = el.querySelector<HTMLElement>('[data-burst]')!;
    const c = { v: 0 };

    const growFromSpark = () => {
      const r = spark.getBoundingClientRect();
      gsap.set(spark, { autoAlpha: 0 });
      return gsap.fromTo(burst,
        { clipPath: `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)` },
        { clipPath: 'inset(0px 0px 0px 0px)', duration: 0.75, ease: 'expo.inOut' });
    };

    gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => { html.style.overflow = ''; setDone(true); },
    })
      .add(wordmarkIn(mark, 0, { construct: true }), 0)
      .to(c, { v: 100, duration: 2.1, ease: 'power3.inOut', onUpdate: () => { num.textContent = String(Math.round(c.v)).padStart(COUNT_DIGITS, '0'); } }, 0)
      .add(wordmarkOut(mark, { keepSpark: true }), 2.3)
      .to('[data-meta]', { autoAlpha: 0, duration: 0.3 }, 2.3)
      .add(() => { growFromSpark(); }, 2.85)
      .add(markIntroReady, 3.45)
      .to(el, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 3.5);
  }, { scope: root });

  if (done) return null;
  return (
    <div ref={root} className="studio-preloader fixed inset-0 z-[120] bg-[hsl(var(--ink))]" aria-hidden="true">
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var d=document.documentElement;if(sessionStorage.getItem('${INTRO_KEY}')==='1'){d.classList.add('intro-seen')}if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('${LOGO_PENDING_CLASS}')}}catch(e){}`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <Wordmark full grid className="preloader-mark text-[16vw] sm:text-[11vw] lg:text-[8vw] invisible" />
      </div>
      <span data-meta data-count className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 font-mono text-[11px] tracking-[0.18em] text-white/60 tabular-nums">000</span>
      <div data-burst className="absolute inset-0 bg-[hsl(var(--ember))]" style={{ clipPath: 'inset(50%)' }} />
    </div>
  );
}
