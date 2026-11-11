'use client';

import { useRef, useState, type SyntheticEvent } from 'react';
import Image from 'next/image';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/studio-motion';

const REVEAL = { duration: 1.3, ease: 'expo.out', scale: 1.12, start: 'top 88%' };
const HIDDEN_CLIP = 'inset(100% 0% 0% 0%)';
const SHOWN_CLIP = 'inset(0% 0% 0% 0%)';
const SCREEN_RATIO = 16 / 10;
const TALLEST_NATURAL_RATIO = 0.75;
const LOGO_MAX_WIDTH = 600;
const SQUARE_TOLERANCE = 0.25;

type Shape = 'screen' | 'logo';

interface RevealImageProps {
  src: string;
  alt: string;
  sizes: string;
  fallback: string;
  priority?: boolean;
  /** panel: fixed-ratio panel with the shot framed inside. natural: frame sized to the shot. */
  variant?: 'panel' | 'natural';
  hideOnError?: boolean;
  className?: string;
}

const shapeOf = (w: number, h: number): Shape =>
  w <= LOGO_MAX_WIDTH || Math.abs(w / h - 1) < SQUARE_TOLERANCE ? 'logo' : 'screen';

function BrowserChrome() {
  return (
    <div aria-hidden="true" className="flex h-5 sm:h-7 flex-shrink-0 items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 bg-[#1b1b1b]">
      <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white/25" />
      <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white/25" />
      <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white/25" />
    </div>
  );
}

export default function RevealImage({ src, alt, sizes, fallback, priority = false, variant = 'panel', hideOnError = false, className = '' }: RevealImageProps) {
  const root = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!src);
  const [shape, setShape] = useState<Shape>('screen');
  const [ratio, setRatio] = useState(SCREEN_RATIO);

  useGSAP(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: REVEAL.start, once: true } });
    tl.fromTo(el, { clipPath: HIDDEN_CLIP }, { clipPath: SHOWN_CLIP, duration: REVEAL.duration, ease: REVEAL.ease, clearProps: 'clipPath' })
      .fromTo(el.querySelector('[data-reveal-media]'), { scale: REVEAL.scale, yPercent: 6 }, { scale: 1, yPercent: 0, duration: REVEAL.duration * 1.2, ease: REVEAL.ease }, 0);
  }, { scope: root });

  const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (!w || !h) return;
    setShape(shapeOf(w, h));
    setRatio(Math.max(w / h, TALLEST_NATURAL_RATIO));
  };

  const image = (fit: string) => (
    <Image src={src} alt={alt} fill unoptimized priority={priority} sizes={sizes} onLoad={onLoad} onError={() => setFailed(true)} className={fit} />
  );

  if (failed && hideOnError) return null;

  if (failed) {
    return (
      <div ref={root} data-no-reveal className={`relative overflow-hidden bg-foreground text-background ${variant === 'natural' ? 'aspect-[16/10]' : ''} ${className}`}>
        <div data-reveal-media className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-5xl sm:text-7xl font-bold tracking-[-0.05em]">{fallback}</span>
        </div>
      </div>
    );
  }

  if (shape === 'logo') {
    return (
      <div ref={root} data-no-reveal className={`relative overflow-hidden bg-white ${variant === 'natural' ? 'aspect-[16/10]' : ''} ${className}`}>
        <div data-reveal-media className="absolute inset-[18%]">{image('object-contain')}</div>
      </div>
    );
  }

  if (variant === 'natural') {
    return (
      <div ref={root} data-no-reveal className={`overflow-hidden bg-[#1b1b1b] ring-1 ring-border ${className}`}>
        <BrowserChrome />
        <div data-reveal-media className="relative" style={{ aspectRatio: ratio }}>{image('object-cover object-top')}</div>
      </div>
    );
  }

  return (
    <div ref={root} data-no-reveal className={`relative overflow-hidden bg-muted ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,hsl(var(--foreground)/0.06),transparent_60%)]" />
      <div data-reveal-media className="absolute inset-0 flex items-center justify-center">
        <div
          data-frame
          style={{ aspectRatio: Math.max(ratio, SCREEN_RATIO) }}
          className="flex w-[86%] max-h-[84%] flex-col overflow-hidden rounded-[10px] sm:rounded-[14px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/10 motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out"
        >
          <BrowserChrome />
          <div className="relative flex-1 bg-white">{image('object-cover object-top')}</div>
        </div>
      </div>
    </div>
  );
}
