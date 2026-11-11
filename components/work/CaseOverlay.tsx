'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/lib/studio-motion';
import { STUDIO_FONT_VARS } from '@/lib/studio-fonts';
import { openLeadSheet } from '@/lib/lead-sheet';
import { CASE_OVERLAY_OPEN_CLASS, WORK, WORK_QUERY_KEY, getWork, workIndex } from '@/lib/work';
import { CONTAINER, EYEBROW, FOCUS_RING, pad2 } from '@/components/studio/ui';
import CaseBody from './CaseBody';

const CLIP_RADIUS = 22;
const OPEN = { duration: 0.95, ease: 'expo.inOut' };
const CLOSE = { duration: 0.75, ease: 'expo.inOut' };
const FADE = { duration: 0.45, ease: 'power3.inOut' };
const RISE = { y: 32, duration: 0.9, stagger: 0.06, delay: 0.4, ease: 'expo.out' };
const SWAP = { out: 0.25, in: 0.6, y: 20 };
const FALLBACK_Y = 40;
const FULL_CLIP = 'inset(0px 0px 0px 0px round 0px)';
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface CaseOverlayProps {
  initialSlug: string;
  fromUrl: boolean;
  getOrigin: (slug: string) => HTMLElement | null;
  onClosed: () => void;
}

const urlFor = (slug: string | null) => {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set(WORK_QUERY_KEY, slug);
  else url.searchParams.delete(WORK_QUERY_KEY);
  return `${url.pathname}${url.search}${url.hash}`;
};

const onScreen = (el: HTMLElement | null) => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight ? r : null;
};

const clipFrom = (r: DOMRect) =>
  `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round ${CLIP_RADIUS}px)`;

export default function CaseOverlay({ initialSlug, fromUrl, getOrigin, onClosed }: CaseOverlayProps) {
  const [slug, setSlug] = useState(initialSlug);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const pushed = useRef(false);
  const closing = useRef(false);
  const firstSlug = useRef(true);
  const slugRef = useRef(slug);
  const opening = useRef({ initialSlug, fromUrl, getOrigin });
  slugRef.current = slug;
  const titleId = useId();
  const project = getWork(slug) ?? WORK[0];

  const close = (viaPopState = false, then?: () => void) => {
    const root = rootRef.current;
    if (closing.current || !root) return;
    closing.current = true;
    const finish = () => {
      if (!viaPopState) {
        if (pushed.current) window.history.back();
        else window.history.replaceState(window.history.state, '', urlFor(null));
      }
      onClosed();
      then?.();
    };
    if (prefersReducedMotion()) { finish(); return; }
    const origin = onScreen(getOrigin(slugRef.current));
    if (origin) {
      gsap.fromTo(root, { clipPath: FULL_CLIP }, { clipPath: clipFrom(origin), ...CLOSE, onComplete: finish });
    } else {
      gsap.to(root, { autoAlpha: 0, y: FALLBACK_Y, ...FADE, onComplete: finish });
    }
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { initialSlug: startSlug, fromUrl: startFromUrl, getOrigin: originOf } = opening.current;
    const html = document.documentElement;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - html.clientWidth;
    const returnFocus = document.activeElement as HTMLElement | null;
    const siblings = Array.from(document.body.children).filter((el): el is HTMLElement => el !== root && el instanceof HTMLElement && !el.inert);

    html.classList.add(CASE_OVERLAY_OPEN_CLASS);
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    siblings.forEach((el) => { el.inert = true; });

    if (!startFromUrl) {
      const alreadyThere = new URLSearchParams(window.location.search).get(WORK_QUERY_KEY) === startSlug;
      if (!alreadyThere) window.history.pushState({ [WORK_QUERY_KEY]: startSlug }, '', urlFor(startSlug));
      pushed.current = true;
    }

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      const origin = onScreen(originOf(startSlug));
      if (origin) gsap.fromTo(root, { clipPath: clipFrom(origin) }, { clipPath: FULL_CLIP, ...OPEN, clearProps: 'clipPath' });
      else gsap.fromTo(root, { autoAlpha: 0, y: FALLBACK_Y }, { autoAlpha: 1, y: 0, ...FADE });
      gsap.fromTo('[data-case-anim]', { autoAlpha: 0, y: RISE.y }, { autoAlpha: 1, y: 0, duration: RISE.duration, stagger: RISE.stagger, delay: RISE.delay, ease: RISE.ease });
    }, root);
    closeBtnRef.current?.focus({ preventScroll: true });

    const onPop = () => closeRef.current(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeRef.current(); return; }
      if (e.key !== 'Tab') return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);

    return () => {
      ctx.revert();
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
      html.classList.remove(CASE_OVERLAY_OPEN_CLASS);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      siblings.forEach((el) => { el.inert = false; });
      returnFocus?.focus({ preventScroll: true });
    };
  }, []);

  useLayoutEffect(() => {
    if (firstSlug.current) { firstSlug.current = false; return; }
    rootRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (!prefersReducedMotion()) gsap.fromTo(contentRef.current, { autoAlpha: 0, y: SWAP.y }, { autoAlpha: 1, y: 0, duration: SWAP.in, ease: 'expo.out' });
  }, [slug]);

  useEffect(() => () => { gsap.killTweensOf([rootRef.current, contentRef.current]); }, []);

  const goTo = (next: string) => {
    window.history.replaceState(window.history.state, '', urlFor(next));
    if (prefersReducedMotion()) { setSlug(next); return; }
    gsap.to(contentRef.current, { autoAlpha: 0, y: -SWAP.y, duration: SWAP.out, ease: 'power2.in', onComplete: () => setSlug(next) });
  };

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={`studio ${STUDIO_FONT_VARS} fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-background text-foreground will-change-[clip-path]`}
    >
      <div className="sticky top-0 z-10 bg-background/85 backdrop-blur-md">
        <div className={`${CONTAINER} flex h-16 sm:h-20 items-center justify-between gap-4`}>
          <p className={`${EYEBROW} truncate`}>
            Work <span aria-hidden="true">/</span> <span className="text-foreground">{project.client}</span>
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className={`${EYEBROW} tabular-nums`}>{pad2(workIndex(slug))} / {pad2(WORK.length)}</span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => close()}
              aria-label="Close case study"
              className={`group inline-flex h-11 items-center gap-2 rounded-full border border-foreground/20 pl-4 pr-3 text-sm font-semibold hover:border-foreground transition-colors ${FOCUS_RING}`}
            >
              <span className="hidden sm:inline">Close</span>
              <X className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-500 group-hover:rotate-90" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div ref={contentRef} className="pt-2 sm:pt-4">
        <CaseBody
          key={project.slug}
          project={project}
          titleId={titleId}
          onNext={goTo}
          onStart={() => close(false, openLeadSheet)}
        />
      </div>
    </div>,
    document.body,
  );
}
