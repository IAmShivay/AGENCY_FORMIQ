'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/studio-motion';

/**
 * Infinite marquee that follows scroll: it speeds up and leans with scroll
 * velocity and flips direction with the scroll direction. Idle work stops
 * once it settles; the loop pauses offscreen.
 */
export default function Marquee({ children, speed = 40, reverse = false, className = '' }: {
  children: ReactNode; speed?: number; reverse?: boolean; className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const track = root.current!.querySelector<HTMLElement>('[data-track]')!;
    const dir = reverse ? 1 : -1;
    const loop = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: speed, ease: 'none', repeat: -1 });
    loop.totalTime(speed * 1000); // headroom so reversing never hits time zero
    const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });
    let flip = 1, boost = 0, settling = false;
    const settle = () => {
      boost *= 0.92;
      const ts = loop.timeScale();
      loop.timeScale(ts + (flip * (1 + boost) - ts) * 0.12);
      if (boost < 0.02 && Math.abs(loop.timeScale() - flip) < 0.01) {
        loop.timeScale(flip); skew(0); gsap.ticker.remove(settle); settling = false;
      }
    };
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity();
        flip = self.direction;
        boost = Math.max(boost, Math.min(Math.abs(v) / 250, 6));
        skew(gsap.utils.clamp(-9, 9, (v / 320) * dir));
        if (!settling) { settling = true; gsap.ticker.add(settle); }
      },
      onToggle: (self) => { if (self.isActive) loop.play(); else loop.pause(); },
    });
    if (!st.isActive) loop.pause();
    return () => { st.kill(); gsap.ticker.remove(settle); };
  }, { scope: root });

  return (
    <div ref={root} className={`overflow-hidden whitespace-nowrap select-none ${className}`}>
      <div data-track className="inline-flex will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
