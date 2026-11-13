import {
  AD_FALLBACK_DELAY_MS,
  AD_IDLE_TIMEOUT_MS,
  MONETAG_ALLOWED_FORMAT,
  MONETAG_FORMAT_ATTRIBUTE,
  MONETAG_SCRIPT_ELEMENT_ID,
  MONETAG_ZONE_ATTRIBUTE,
} from '@/lib/ads/config';

const LOAD_EVENT = 'load';
const READY_STATE_COMPLETE = 'complete';

export type AdScriptOptions = { src: string; zone: string | null };

export const findAdScript = (): HTMLScriptElement | null => {
  const element = document.getElementById(MONETAG_SCRIPT_ELEMENT_ID);
  return element instanceof HTMLScriptElement ? element : null;
};

export const injectAdScript = ({ src, zone }: AdScriptOptions): HTMLScriptElement => {
  const existing = findAdScript();
  if (existing) return existing;

  const script = document.createElement('script');
  script.id = MONETAG_SCRIPT_ELEMENT_ID;
  script.async = true;
  script.src = src;
  script.setAttribute(MONETAG_FORMAT_ATTRIBUTE, MONETAG_ALLOWED_FORMAT);
  if (zone) script.setAttribute(MONETAG_ZONE_ATTRIBUTE, zone);
  document.head.appendChild(script);
  return script;
};

export const removeAdScript = (): void => {
  findAdScript()?.remove();
};

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const scheduleIdle = (task: () => void): (() => void) => {
  const w = window as IdleWindow;
  if (w.requestIdleCallback && w.cancelIdleCallback) {
    const handle = w.requestIdleCallback(task, { timeout: AD_IDLE_TIMEOUT_MS });
    return () => w.cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(task, AD_FALLBACK_DELAY_MS);
  return () => window.clearTimeout(handle);
};

export const scheduleAfterInteractive = (task: () => void): (() => void) => {
  let cancelIdle: (() => void) | null = null;
  const start = () => {
    cancelIdle = scheduleIdle(task);
  };

  if (document.readyState === READY_STATE_COMPLETE) {
    start();
  } else {
    window.addEventListener(LOAD_EVENT, start, { once: true });
  }

  return () => {
    window.removeEventListener(LOAD_EVENT, start);
    cancelIdle?.();
  };
};
