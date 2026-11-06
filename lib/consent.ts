import {
  CONSENT_CHANGED_EVENT,
  CONSENT_STATUS,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  META_PIXEL_ID,
  META_PIXEL_SCRIPT_URL,
  OPEN_COOKIE_SETTINGS_EVENT,
  type ConsentStatus,
} from '@/lib/tracking-config';

type StoredConsent = { version: number; status: ConsentStatus; updatedAt: string };

type FbqFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

type TrackingWindow = Window & {
  fbq?: FbqFn;
  _fbq?: FbqFn;
};

const isBrowser = () => typeof window !== 'undefined';

export const getStoredConsent = (): ConsentStatus | null => {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.status === CONSENT_STATUS.GRANTED || parsed.status === CONSENT_STATUS.DENIED) {
      return parsed.status;
    }
    return null;
  } catch {
    return null;
  }
};

export const hasTrackingConsent = () => getStoredConsent() === CONSENT_STATUS.GRANTED;

const storeConsent = (status: ConsentStatus) => {
  try {
    const value: StoredConsent = { version: CONSENT_VERSION, status, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
  }
};

export const loadMetaPixel = () => {
  if (!isBrowser()) return;
  const w = window as TrackingWindow;
  if (w.fbq) {
    w.fbq('consent', 'grant');
    return;
  }

  const fbq: FbqFn = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  } as FbqFn;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  w.fbq = fbq;
  if (!w._fbq) w._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = META_PIXEL_SCRIPT_URL;
  document.head.appendChild(script);

  fbq('consent', 'grant');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
};

const revokeMetaPixel = () => {
  const w = window as TrackingWindow;
  if (typeof w.fbq === 'function') w.fbq('consent', 'revoke');
};

export const applyConsent = (status: ConsentStatus) => {
  if (!isBrowser()) return;
  if (status === CONSENT_STATUS.GRANTED) loadMetaPixel();
  else revokeMetaPixel();
};

export const setConsent = (status: ConsentStatus) => {
  if (!isBrowser()) return;
  storeConsent(status);
  applyConsent(status);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: { status } }));
};

export const openCookieSettings = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
};
