'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/studio-motion';

const NATIVE_CURSOR_ZONES = 'form, [role="dialog"], [role="listbox"], [role="menu"], [data-radix-popper-content-wrapper], [data-native-cursor]';
const TARGETS = '[data-cursor], a, button, input, textarea, select, label, [role="button"]';

const SIZE = { idle: 12, link: 44, media: 76 } as const;
const RADIUS = { idle: 1.5, link: 4, media: 6 } as const;
const FRAME_SIZE = 34;
const QUARTER = 90;
const SPIN_PER_PX = 0.6;
const SETTLE_MS = 140;
const TILT_MAX_DEG = 20;
const TILT_PER_PX = 0.8;

type Mode = keyof typeof SIZE | 'hidden';

export default function StudioCursor() {
  const spark = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const arrow = useRef<SVGSVGElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => { setEnabled(isFinePointer() && !prefersReducedMotion()); }, []);

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    const s = spark.current!, f = frame.current!, a = arrow.current!;
    gsap.set([s, f], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(a, { scale: 0, autoAlpha: 0 });
    const sx = gsap.quickTo(s, 'x', { duration: 0.12, ease: 'power3' });
    const sy = gsap.quickTo(s, 'y', { duration: 0.12, ease: 'power3' });
    const fx = gsap.quickTo(f, 'x', { duration: 0.55, ease: 'power3' });
    const fy = gsap.quickTo(f, 'y', { duration: 0.55, ease: 'power3' });
    const tilt = gsap.quickTo(s, 'rotation', { duration: 0.5, ease: 'power3' });
    const spin = gsap.quickTo(f, 'rotation', { duration: 0.5, ease: 'power3' });

    let shown = false;
    let native = false;
    let mode: Mode = 'idle';
    let current: Element | null = null;
    let last = { x: 0, y: 0 };
    let angle = 0;
    let settleTimer = 0;

    const frameVisible = () => shown && !native && mode === 'idle';

    const setMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      if (next === 'hidden') {
        gsap.to([s, f], { autoAlpha: 0, duration: 0.2 });
        return;
      }
      if (shown && !native) gsap.to(s, { autoAlpha: 1, duration: 0.2 });
      gsap.to(s, { width: SIZE[next], height: SIZE[next], borderRadius: RADIUS[next], duration: 0.5, ease: 'expo.out' });
      gsap.to(a, { scale: next === 'idle' ? 0 : next === 'media' ? 1.35 : 1, autoAlpha: next === 'idle' ? 0 : 1, duration: 0.45, ease: 'expo.out' });
      gsap.to(f, { autoAlpha: frameVisible() ? 1 : 0, scale: next === 'idle' ? 1 : 0.4, duration: 0.35, ease: 'power3.out' });
    };

    const settle = () => {
      angle = Math.round(angle / QUARTER) * QUARTER;
      gsap.to(f, { rotation: angle, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
      tilt(0);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown && !native) {
        shown = true;
        gsap.set([s, f], { x: e.clientX, y: e.clientY });
        gsap.to(s, { autoAlpha: mode === 'hidden' ? 0 : 1, duration: 0.3 });
        gsap.to(f, { autoAlpha: frameVisible() ? 1 : 0, duration: 0.3 });
      }
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      sx(e.clientX); sy(e.clientY); fx(e.clientX); fy(e.clientY);
      angle += Math.hypot(dx, dy) * SPIN_PER_PX * (dx >= 0 ? 1 : -1);
      spin(angle);
      tilt(gsap.utils.clamp(-TILT_MAX_DEG, TILT_MAX_DEG, dx * TILT_PER_PX));
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_MS);
    };

    const over = (e: PointerEvent) => {
      const el = e.target as Element;
      const inNativeZone = !!el.closest(NATIVE_CURSOR_ZONES);
      if (inNativeZone !== native) {
        native = inNativeZone;
        gsap.to([s, f], { autoAlpha: native ? 0 : 1, duration: 0.2 });
        if (!native) { current = null; mode = 'hidden'; }
      }
      if (native) return;
      const t = el.closest(TARGETS);
      if (t === current && mode !== 'hidden') return;
      current = t;
      if (!t) return setMode('idle');
      if (t.matches('input, textarea, select')) return setMode('hidden');
      const media = t.hasAttribute('data-cursor') || (t.matches('a') && !!t.querySelector('img, video, canvas'));
      setMode(media ? 'media' : 'link');
    };

    const leave = () => { gsap.to([s, f], { autoAlpha: 0, duration: 0.3 }); shown = false; };
    const down = () => {
      gsap.to(s, { scale: 0.75, duration: 0.15 });
      angle += QUARTER;
      gsap.to(f, { rotation: angle, scale: 0.8, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
    };
    const up = () => {
      gsap.to(s, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      gsap.to(f, { scale: mode === 'idle' ? 1 : 0.4, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    };

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
      clearTimeout(settleTimer);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div
        ref={frame}
        className="fixed left-0 top-0 z-[9998] rounded-[3px] border-[1.5px] border-white mix-blend-difference will-change-transform"
        style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
      />
      <div
        ref={spark}
        className="fixed left-0 top-0 z-[9999] flex items-center justify-center will-change-transform"
        style={{ width: SIZE.idle, height: SIZE.idle, borderRadius: RADIUS.idle, background: 'hsl(var(--ember))' }}
      >
        <svg ref={arrow} viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="hsl(var(--ink))" strokeWidth="1.8" strokeLinecap="square">
          <path d="M5 11 11 5M6 5h5v5" />
        </svg>
      </div>
    </div>
  );
}
