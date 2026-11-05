import { gsap } from '@/lib/studio-motion';

/*
 * Wordmark: "Formiq Studio" set tight in the display face — a bold first word
 * and a lighter, muted second. The single signature detail is the dot of the
 * i in Formiq, drawn as a small square: it lands last on entrance and makes a
 * quiet quarter-turn on hover. Monochrome via theme tokens.
 */

const letters = (word: string) =>
  word.split('').map((c, i) => (
    <span key={i} data-wm-c className="inline-block">{c}</span>
  ));

export default function Wordmark({ className = '', full = false }: { className?: string; full?: boolean }) {
  return (
    <span className={`wordmark ${full ? 'wm-full' : ''} ${className}`} role="img" aria-label="FormiqStudio">
      <span className="wm-word wm-first" aria-hidden="true">
        {letters('Form')}
        {/* dotless ı + square tittle */}
        <span data-wm-c className="relative inline-block">
          ı<span data-wm-dot className="wm-tittle" />
        </span>
        {letters('q')}
      </span>
      <span className="wm-tail" aria-hidden="true">
        <span className="wm-word wm-last">{letters('Studio')}</span>
      </span>
    </span>
  );
}

// Alternate letters enter from above and below their mask.
const fromY = (i: number) => (i % 2 ? 110 : -110);

export function wordmarkIn(root: Element, delay = 0) {
  const chars = root.querySelectorAll('[data-wm-c]');
  const dot = root.querySelector('[data-wm-dot]');
  return gsap.timeline({ delay })
    .set(root, { autoAlpha: 1 })
    .from(chars, { yPercent: (i) => fromY(i), duration: 1, ease: 'expo.out', stagger: 0.04 }, 0)
    .from(dot, { yPercent: -500, autoAlpha: 0, duration: 0.7, ease: 'power4.out' }, 0.6);
}

/** Letters leave the way they came; the tittle lifts off first. */
export function wordmarkOut(root: Element) {
  const chars = root.querySelectorAll('[data-wm-c]');
  return gsap.timeline()
    .to(root.querySelector('[data-wm-dot]'), { yPercent: -500, autoAlpha: 0, duration: 0.35, ease: 'power3.in' }, 0)
    .to(chars, { yPercent: (i) => -fromY(i), duration: 0.5, ease: 'power3.in', stagger: 0.02 }, 0.05);
}

/** Hover: the square tittle turns a quarter into a diamond and settles back. Returns a cleanup. */
export function wordmarkHover(host: HTMLElement, root: Element) {
  const dot = root.querySelector('[data-wm-dot]');
  const enter = () => {
    gsap.timeline({ overwrite: 'auto' })
      .to(dot, { rotate: 45, scale: 0.85, duration: 0.35, ease: 'power3.out' })
      .to(dot, { rotate: 90, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
      .set(dot, { rotate: 0 });
  };
  host.addEventListener('pointerenter', enter);
  return () => host.removeEventListener('pointerenter', enter);
}
