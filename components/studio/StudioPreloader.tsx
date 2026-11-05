'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion, markIntroReady } from '@/lib/studio-motion';
import Wordmark, { wordmarkIn, wordmarkOut } from './Wordmark';

/**
 * First visit per session only: the wordmark assembles letter by letter, a
 * counter runs, the letters scatter back out, then the screen splits open.
 * Repeat visits skip it before first paint (inline script), and a CSS failsafe
 * hides it even if JS never runs.
 */
export default function StudioPreloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(() => {
    const html = document.documentElement;
    if (html.classList.contains('intro-seen') || prefersReducedMotion()) {
      markIntroReady(); setDone(true); return;
    }
    try { sessionStorage.setItem('formiq-intro', '1'); } catch { /* storage blocked */ }
    html.style.overflow = 'hidden';
    const num = root.current!.querySelector<HTMLElement>('[data-count]')!;
    const mark = root.current!.querySelector('.wordmark')!;
    const c = { v: 0 };
    gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => { html.style.overflow = ''; setDone(true); },
    })
      .add(wordmarkIn(mark), 0)
      .from('[data-tag]', { autoAlpha: 0, y: 10, duration: 0.6 }, 0.3)
      .to(c, { v: 100, duration: 1.2, ease: 'power3.inOut', onUpdate: () => { num.textContent = String(Math.round(c.v)).padStart(3, '0'); } }, 0)
      .to('[data-line]', { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, 0)
      .add(wordmarkOut(mark), 1.3)
      .to('[data-meta]', { autoAlpha: 0, duration: 0.3 }, 1.3)
      .add(markIntroReady, 1.75)
      .to('[data-top]', { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, 1.7)
      .to('[data-bottom]', { yPercent: 100, duration: 0.85, ease: 'expo.inOut' }, 1.7);
  }, { scope: root });

  if (done) return null;
  return (
    <div ref={root} className="studio-preloader fixed inset-0 z-[120]" aria-hidden="true">
      {/* Runs during HTML parse: repeat visits never see the overlay at all. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "try{if(sessionStorage.getItem('formiq-intro')==='1'){document.documentElement.classList.add('intro-seen')}}catch(e){}",
        }}
      />
      <div data-top className="absolute inset-x-0 top-0 h-1/2 bg-[#0a0a0a]" />
      <div data-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0a0a0a]" />
      <div data-inner className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
        <Wordmark full className="preloader-mark text-[12vw] sm:text-[8vw] lg:text-[6.5vw] invisible" />
        <div data-meta className="mt-8 w-[min(320px,70vw)]">
          <div className="h-px bg-white/15 overflow-hidden"><div data-line className="h-full bg-white origin-left scale-x-0" /></div>
          <div className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
            <span data-tag>More customers, less confusion</span>
            <span data-count className="text-white tabular-nums">000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
