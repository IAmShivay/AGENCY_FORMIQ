'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, useGSAP, prefersReducedMotion, navState } from '@/lib/studio-motion';

let firstMount = true;

const labelFor = (path: string) => {
  const seg = path.split('/').filter(Boolean);
  return seg.length ? seg.map((s) => s.replace(/-/g, ' ')).join(' / ') : 'home';
};

/**
 * Page transition. Mounted by app/(routes)/template.tsx, which remounts on every
 * navigation: a full-bleed panel carrying the destination name lifts away to
 * reveal the new page. Skipped on the very first load (the preloader owns that).
 */
export default function RouteCurtain() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    if (firstMount) { firstMount = false; return; }
    navState.clientNav = true;
    if (prefersReducedMotion()) return;
    // Layout effect: shown before the new route's first paint, so there's no flash.
    gsap.set(ref.current, { display: 'flex' });
    gsap.timeline({ onComplete: () => { gsap.set(ref.current, { display: 'none' }); } })
      .fromTo('[data-curtain-label]', { yPercent: 0, autoAlpha: 1 }, { yPercent: -60, autoAlpha: 0, duration: 0.45, ease: 'power3.in' }, 0.15)
      .fromTo(ref.current, { yPercent: 0 }, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, 0.25);
  }, { scope: ref });

  return (
    <div ref={ref} aria-hidden="true" className="fixed inset-0 z-[110] bg-foreground text-background hidden items-end pointer-events-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 overflow-hidden">
        <p data-curtain-label className="font-mono text-xs uppercase tracking-[0.2em]">~/{labelFor(pathname)}</p>
      </div>
    </div>
  );
}
