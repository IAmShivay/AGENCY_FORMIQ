'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/studio-motion';

/**
 * Desktop cursor: a precise dot and a lagging ring, each blending on its own.
 * Links get a larger ring; `data-cursor="Label"` (or a link wrapping an image)
 * fills the ring with a label.
 */
export default function StudioCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => { setEnabled(isFinePointer() && !prefersReducedMotion()); }, []);

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    const d = dot.current!, r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'power3' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'power3' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.45, ease: 'power3' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.45, ease: 'power3' });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) { gsap.to([d, r], { opacity: 1, duration: 0.3 }); shown = true; }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    let current: Element | null = null;
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest('[data-cursor], a, button, input, textarea, select, label, [role="button"]');
      if (t === current) return;
      current = t;
      const field = !!t?.matches('input, textarea, select');
      const text = t?.getAttribute('data-cursor') ?? (t?.matches('a') && t.querySelector('img') ? 'View' : '');
      setLabel(text);
      gsap.to(r, {
        width: text ? 92 : t && !field ? 54 : 32, height: text ? 92 : t && !field ? 54 : 32,
        backgroundColor: text ? '#fff' : 'rgba(255,255,255,0)', opacity: field ? 0 : 1,
        duration: 0.45, ease: 'expo.out',
      });
      gsap.to(d, { scale: t ? 0 : 1, duration: 0.3 });
    };
    const leave = () => { gsap.to([d, r], { opacity: 0, duration: 0.3 }); shown = false; };
    const down = () => gsap.to(r, { scale: 0.82, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)' });
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    html.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      html.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      html.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div ref={ring} className="fixed top-0 left-0 z-[95] w-8 h-8 rounded-full border border-white mix-blend-difference flex items-center justify-center will-change-transform">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-black">{label}</span>
      </div>
      <div ref={dot} className="fixed top-0 left-0 z-[95] w-1.5 h-1.5 rounded-full bg-white mix-blend-difference will-change-transform" />
    </div>
  );
}
