'use client';

import { useEffect, useRef, type ReactElement } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/studio-motion';

/** Pulls its single child toward the pointer, then springs back on leave. */
export default function Magnetic({ children, strength = 0.32 }: { children: ReactElement; strength?: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [strength]);

  return <Slot ref={ref}>{children}</Slot>;
}
