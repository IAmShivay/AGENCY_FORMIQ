'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/studio-motion';

export default function ReadProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bar.current || prefersReducedMotion()) return;
    gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
  });

  return <div ref={bar} aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-primary motion-reduce:hidden" />;
}
