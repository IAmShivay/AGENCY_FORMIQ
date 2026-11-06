'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  gsap, ScrollTrigger, prefersReducedMotion, introReady, scrambleText, shouldPlayEntrance,
} from '@/lib/studio-motion';
import StudioCursor from './StudioCursor';

const DARK_THEMES = new Set(['dark']);
const PHONE_QUERY = '(max-width: 767px)';
const REVEAL = {
  phone: { heading: 10, item: 14, headingDuration: 0.7, itemDuration: 0.6, stagger: 0.04 },
  desktop: { heading: 16, item: 20, headingDuration: 0.9, itemDuration: 0.8, stagger: 0.06 },
} as const;
const REVEAL_MARGIN = '0px 0px -8% 0px';
const IMAGE_REVEAL_MARGIN = '0px 0px -5% 0px';

const SCROLLING_X = new Set(['auto', 'scroll']);
const inScrollRail = (el: HTMLElement, stop: HTMLElement) => {
  for (let n = el.parentElement; n && n !== stop; n = n.parentElement) {
    if (SCROLLING_X.has(getComputedStyle(n).overflowX)) return true;
  }
  return false;
};

const byTop = (a: HTMLElement, b: HTMLElement) => a.getBoundingClientRect().top - b.getBoundingClientRect().top;

const onReveal = (targets: HTMLElement[], rootMargin: string, show: (els: HTMLElement[]) => void) => {
  const io = new IntersectionObserver((entries) => {
    const els = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
    if (!els.length) return;
    els.forEach((el) => io.unobserve(el));
    show(els.sort(byTop));
  }, { rootMargin });
  targets.forEach((t) => io.observe(t));
  return io;
};

/** An element (or an ancestor up to main) already animated by framer-motion or inline styles. */
const ownedByOtherMotion = (el: HTMLElement, stop: HTMLElement) => {
  for (let n: HTMLElement | null = el; n && n !== stop; n = n.parentElement) {
    if (n.style.transform || n.style.opacity) return true;
  }
  return false;
};

/**
 * Marketing-site motion + theme layer. Everything here is additive and keyed to
 * the route, so it re-runs on navigation and cleans itself up.
 */
export default function StudioShell() {
  const pathname = usePathname();
  const progress = useRef<HTMLDivElement>(null);

  // Theme: monochrome tokens on <html> (reaches portals) and a `.dark` class so
  // Tailwind's class-based `dark:` variants follow the data-theme attribute.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('studio-root');
    const sync = () => html.classList.toggle('dark', DARK_THEMES.has(html.getAttribute('data-theme') || ''));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => { mo.disconnect(); html.classList.remove('studio-root', 'dark'); };
  }, []);

  // New route: start at the top (unless jumping to an anchor), then wire reveals.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const main = document.getElementById('studio-main');
    if (!main || prefersReducedMotion()) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;
    const observers: IntersectionObserver[] = [];
    const run = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const rv = window.matchMedia(PHONE_QUERY).matches ? REVEAL.phone : REVEAL.desktop;
        // Content already painted on screen for a returning visitor stays put (no blink).
        const entrance = shouldPlayEntrance();
        const onScreen = (el: HTMLElement) => el.getBoundingClientRect().top < window.innerHeight;
        const skip = (el: HTMLElement) =>
          !!el.closest('[data-no-reveal], [data-hero], header, footer, [role="dialog"]') || ownedByOtherMotion(el, main) || inScrollRail(el, main)
          || (!entrance && onScreen(el));

        // Headings rise out of a clip mask. Whole-element clip (no text splitting),
        // so dynamic React content underneath is never touched.
        const headings = Array.from(main.querySelectorAll<HTMLElement>('h1, h2')).filter((el) => !skip(el));
        if (headings.length) {
          gsap.set(headings, { clipPath: 'inset(0% 0% 100% 0%)', y: rv.heading, transition: 'none' });
          observers.push(onReveal(headings, REVEAL_MARGIN, (els) => gsap.to(els, {
            clipPath: 'inset(0% 0% -25% 0%)', y: 0, duration: rv.headingDuration, ease: 'expo.out', stagger: 0.06, clearProps: 'clipPath,transform,transition',
          })));
        }

        // Cards and grid items: staggered fade-up as they enter together.
        const items = Array.from(main.querySelectorAll<HTMLElement>('section .grid > *, [data-reveal]'))
          .filter((el) => !skip(el) && el.offsetHeight < window.innerHeight * 1.4);
        if (items.length) {
          // CSS transitions (hover lifts, transition-all) are suspended while GSAP drives the
          // transform, then handed back.
          gsap.set(items, { y: rv.item, autoAlpha: 0, transition: 'none' });
          observers.push(onReveal(items, REVEAL_MARGIN, (els) => gsap.to(els, {
            y: 0, autoAlpha: 1, duration: rv.itemDuration, ease: 'expo.out', stagger: rv.stagger, clearProps: 'transform,transition',
          })));
        }

        // Small uppercase labels decode like a terminal when they appear.
        main.querySelectorAll<HTMLElement>('p, span, div').forEach((el) => {
          const c = el.className;
          if (typeof c !== 'string' || !c.includes('uppercase') || !c.includes('tracking') || skip(el)) return;
          const t = el.textContent?.trim() ?? '';
          if (el.childNodes.length !== 1 || t.length < 3 || t.length > 40) return;
          ScrollTrigger.create({ trigger: el, start: 'clamp(top 92%)', once: true, onEnter: () => scrambleText(el) });
        });

        // Stats such as "50+", "4.9", "15" count up from zero.
        main.querySelectorAll<HTMLElement>('div, span, p, strong').forEach((el) => {
          if (el.childNodes.length !== 1 || el.firstChild?.nodeType !== Node.TEXT_NODE || skip(el)) return;
          const c = typeof el.className === 'string' ? el.className : '';
          if (!/font-(bold|extrabold|black)/.test(c)) return;
          const m = el.textContent!.trim().match(/^(\d+(?:\.\d+)?)([+×x%]?)$/);
          if (!m) return;
          const end = parseFloat(m[1]);
          const decimals = (m[1].split('.')[1] ?? '').length;
          const node = el.firstChild!;
          const v = { n: 0 };
          gsap.to(v, {
            n: end, duration: 1.6, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'clamp(top 92%)', once: true },
            onUpdate: () => { node.nodeValue = v.n.toFixed(decimals) + m[2]; },
          });
        });

        // Images inside cropped frames settle from a slight zoom.
        const images = Array.from(main.querySelectorAll<HTMLImageElement>('section .overflow-hidden img')).filter((img) => !skip(img));
        if (images.length) {
          gsap.set(images, { scale: 1.1, transition: 'none' });
          observers.push(onReveal(images, IMAGE_REVEAL_MARGIN, (els) => gsap.to(els, {
            scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'scale,transform,transition',
          })));
        }

        gsap.to(progress.current, {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
        });
      }, main);
      ScrollTrigger.refresh();
    };
    // Wait for the intro to clear and the route's DOM to settle.
    const frame = requestAnimationFrame(() => { introReady.then(() => requestAnimationFrame(run)); });
    // Late content (fetched lists, ads) changes page height; re-measure once it lands.
    const late = window.setTimeout(() => ScrollTrigger.refresh(), 1800);
    return () => { cancelled = true; cancelAnimationFrame(frame); clearTimeout(late); observers.forEach((o) => o.disconnect()); ctx?.revert(); };
  }, [pathname]);

  return (
    <>
      <div ref={progress} aria-hidden="true" className="fixed top-0 inset-x-0 h-[2px] z-[70] bg-foreground origin-left scale-x-0 pointer-events-none" />
      <StudioCursor />
    </>
  );
}
