import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // Mobile address-bar show/hide resizes the viewport; re-measuring on it causes jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/** Rough device tier: weaker machines get lighter effects. */
export const isLowEnd = () => {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
};


// Resolves once the preloader has cleared (immediately when it is skipped).
let resolveIntro: () => void = () => {};
export const introReady: Promise<void> =
  typeof window === 'undefined' ? Promise.resolve() : new Promise<void>((r) => { resolveIntro = r; });
export const markIntroReady = () => resolveIntro();

const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

/**
 * Decodes text left to right. Writes through the element's existing text node
 * (never replaces it), so React's reference to that node stays valid.
 */
export function scrambleText(el: HTMLElement, text?: string, duration = 650) {
  const node = el.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE || el.childNodes.length !== 1) return;
  const finalText = text ?? el.dataset.text ?? node.nodeValue ?? '';
  el.dataset.text = finalText;
  if (prefersReducedMotion()) { node.nodeValue = finalText; return; }
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min((now - start) / duration, 1);
    const resolved = Math.floor(p * finalText.length);
    let out = finalText.slice(0, resolved);
    for (let i = resolved; i < finalText.length; i++) {
      out += finalText[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    node.nodeValue = out;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * True once the visitor has navigated client-side (set by RouteCurtain). Entrance
 * animations only replay when content isn't already painted from the server,
 * so returning visitors never see server-rendered text blink out and back.
 */
export const navState = { clientNav: false };
export const shouldPlayEntrance = () =>
  !prefersReducedMotion() && (navState.clientNav || !document.documentElement.classList.contains('intro-seen'));
