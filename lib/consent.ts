import {
  CONSENT_CHANGED_EVENT,
  META_PIXEL_ID,
  META_PIXEL_SCRIPT_URL,
  OPEN_COOKIE_SETTINGS_EVENT,
} from '@/lib/tracking-config';
import {
  createConsent,
  readStoredConsent,
  writeStoredConsent,
  type ConsentChoice,
  type StoredConsent,
} from '@/lib/consent-storage';

export type { ConsentChoice, StoredConsent } from '@/lib/consent-storage';

export type ConsentChangedDetail = { consent: StoredConsent };

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

export const getStoredConsent = (): StoredConsent | null => readStoredConsent();

export const hasTrackingConsent = () => getStoredConsent()?.measurement === true;

export const hasAdvertisingConsent = () => getStoredConsent()?.advertising === true;

export const needsConsentPrompt = (consent: StoredConsent | null, advertisingOffered: boolean) =>
  consent === null || (advertisingOffered && consent.advertising === null);

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

export const applyConsent = (consent: StoredConsent) => {
  if (!isBrowser()) return;
  if (consent.measurement) loadMetaPixel();
  else revokeMetaPixel();
};

export const setConsent = (choice: ConsentChoice) => {
  if (!isBrowser()) return;
  const consent = createConsent(choice);
  writeStoredConsent(consent);
  applyConsent(consent);
  window.dispatchEvent(
    new CustomEvent<ConsentChangedDetail>(CONSENT_CHANGED_EVENT, { detail: { consent } })
  );
};

export const openCookieSettings = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
};
